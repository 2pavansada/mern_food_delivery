import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import BitezyLogo from '../../components/BitezyLogo/BitezyLogo';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", { success, orderId });
      if (response.data.success) {
        if (orderId) {
          navigate(`/track/${orderId}`);
        } else {
          navigate('/myorders');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate('/');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <BitezyLogo size="md" showTagline={false} />
        <div className="verify-spinner-ring">
          <div className="spinner-inner"></div>
        </div>
        <h2 className="verify-heading">Verifying Your Payment</h2>
        <p className="verify-subtext">
          Please wait a moment while BITEZY securely confirms your transaction with Stripe.
        </p>
      </div>
    </div>
  );
};

export default Verify;
