import fs from 'fs';
import path from 'path';
import os from 'os';
import foodModel from '../models/foodModel.js';

// Helper to upload to Cloudinary using native fetch if configured
const uploadToCloudinaryIfConfigured = async (filePath) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || (!uploadPreset && (!apiKey || !apiSecret))) {
        return null;
    }

    try {
        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer]);
        const formData = new FormData();
        formData.append('file', blob, path.basename(filePath));

        if (uploadPreset) {
            formData.append('upload_preset', uploadPreset);
        } else if (apiKey && apiSecret) {
            // Signed upload
            const timestamp = Math.round(new Date().getTime() / 1000);
            const crypto = await import('crypto');
            const stringToSign = `timestamp=${timestamp}${apiSecret}`;
            const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');
            formData.append('timestamp', timestamp);
            formData.append('api_key', apiKey);
            formData.append('signature', signature);
        }

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data && data.secure_url) {
            // Clean up temporary local file
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, () => {});
            }
            return data.secure_url;
        } else {
            console.warn("Cloudinary upload response warning:", data);
            return null;
        }
    } catch (err) {
        console.error("Cloudinary upload error (falling back to local storage):", err.message);
        return null;
    }
};

// Add food item
const addFood = async (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'Image file is required' });
    }

    let imageValue = req.file.filename;

    // Check if Cloudinary is configured for persistent cloud storage
    try {
        const cloudUrl = await uploadToCloudinaryIfConfigured(req.file.path);
        if (cloudUrl) {
            imageValue = cloudUrl;
        }
    } catch (uploadErr) {
        console.warn("Could not upload to cloud, using local filename:", uploadErr.message);
    }

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        image: imageValue
    });

    try {
        await food.save();
        res.json({ success: true, message: 'Food Added' });
    } catch (error) {
        console.error("Error adding food item:", error);
        res.json({ success: false, message: 'Error adding food item' });
    }
};

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Error listing foods:", error);
        res.json({ success: false, message: 'Error fetching food items' });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            // Check and remove local image file safely if not a remote URL
            if (food.image && !food.image.startsWith('http://') && !food.image.startsWith('https://')) {
                const pathsToTry = [
                    path.join('uploads', food.image),
                    path.join(os.tmpdir(), 'uploads', food.image)
                ];
                for (const p of pathsToTry) {
                    if (fs.existsSync(p)) {
                        fs.unlink(p, () => {});
                    }
                }
            }
            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: 'Food Removed' });
        } else {
            res.json({ success: false, message: 'Food not found' });
        }
    } catch (error) {
        console.error("Error removing food:", error);
        res.json({ success: false, message: 'Error removing food item' });
    }
};

export { addFood, listFood, removeFood };
