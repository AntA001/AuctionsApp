import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastBody from 'react-bootstrap/ToastBody';
import ToastHeader from 'react-bootstrap/ToastHeader';

import './Toast.scss';

export default function ToastMessage({
  show,
  message,
  bg,
  onClose,
}: {
  show: boolean;
  message: string;
  bg: string;
  onClose?: () => void;
}) {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  const handleClose = () => {
    setShowToast(false);
    if (onClose) onClose(); // Calls onClose if it's provided
  };

  return (
    <Toast
      className="toast-message"
      bg={bg}
      onClose={handleClose}
      show={showToast}
      delay={4000}
      autohide
    >
      <ToastHeader>
        <strong className="me-auto">Notification</strong>
      </ToastHeader>
      <ToastBody style={{ color: 'white' }}>{message}</ToastBody>
    </Toast>
  );
}
