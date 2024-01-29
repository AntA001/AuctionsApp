import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastBody from 'react-bootstrap/ToastBody';
import ToastHeader from 'react-bootstrap/ToastHeader';

export default function ToastMessage({
  show,
  message,
  bg,
}: {
  show: boolean;
  message: string;
  bg: string;
}) {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
  }, [show]);
  return (
    <Toast
      bg={bg}
      onClose={() => setShowToast(false)}
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
