import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAbideStripe } from '../utils/stripe';
import { useAuth } from '../hooks/useAuth';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void; // optional, handled internally now
}

export default function PremiumModal({ visible, onClose }: PremiumModalProps) {
  const { presentPaymentSheet, initPaymentSheet } = useAbideStripe();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch PaymentSheet params from backend
      const res = await fetch('http://localhost:4242/create-subscription-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch payment sheet params');
      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        customerId: data.customer,
        customerEphemeralKeySecret: data.ephemeralKey,
        paymentIntentClientSecret: data.paymentIntent,
        merchantDisplayName: 'Abide Daily',
        allowsDelayedPaymentMethods: false,
      });
      if (initError) throw new Error(initError.message);
      // 3. Present payment sheet
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        setError(presentError.message);
      } else {
        onClose();
      }
    } catch (e: any) {
      setError(e.message || 'Failed to start payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal} accessibilityRole="dialog">
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.text}>Unlock journaling, mood, and habit tracking with a 3-day free trial, then $5.99/month. Cancel anytime.</Text>
          {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button title="Subscribe Now" onPress={handleSubscribe} />
          )}
          <Button title="Not Now" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: 320, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
});
