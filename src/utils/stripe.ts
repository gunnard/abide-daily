import { Platform } from 'react-native';
import { initStripe, useStripe } from '@stripe/stripe-react-native';

export async function initializeStripe() {
  await initStripe({
    publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX', // TODO: Replace with your real key
    merchantIdentifier: Platform.OS === 'ios' ? 'merchant.com.abidedaily' : undefined,
    setUrlSchemeOnAndroid: true,
  });
}

export function useAbideStripe() {
  const stripe = useStripe();
  return stripe;
}
