import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import SimpleCountryPicker from '../../components/SimpleCountryPicker';

interface Country {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
}

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const { sendOtp, login } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'United States',
    code: 'US',
    callingCode: '1',
    flag: '🇺🇸'
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const otpInputs = useRef<(TextInput | null)[]>([]);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 6) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }
    const fullNumber = `+${selectedCountry.callingCode}${phoneNumber}`;
    try {
      setIsSendingOtp(true);
      await sendOtp(fullNumber);
      setShowOtpInput(true);
      Alert.alert('OTP Sent', `Verification code sent to ${fullNumber}`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
    if (index === 3 && value) {
      verifyOtp(newOtp.join(''));
    }
  };

  const verifyOtp = async (otpValue: string) => {
    const fullNumber = `+${selectedCountry.callingCode}${phoneNumber}`;
    try {
      setIsLoading(true);
      await login(fullNumber, otpValue);
      router.replace('/(auth)/location');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid OTP');
      setOtp(['', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.description}>
          We'll send you a verification code to ensure your account security
        </Text>
        
        {!showOtpInput ? (
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.countryPickerButton}
              onPress={() => setShowCountryPicker(true)}>
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCodeText}>+{selectedCountry.callingCode}</Text>
              <Text style={styles.countryNameText}>{selectedCountry.name}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={15}
              editable={!isSendingOtp}
            />
            <TouchableOpacity
              style={[styles.button, isSendingOtp && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.otpContainer}>
            <Text style={styles.otpDescription}>
              Enter the 4-digit code sent to +{selectedCountry.callingCode}{phoneNumber}
            </Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(input) => {
                    otpInputs.current[index] = input;
                  }}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  editable={!isLoading}
                />
              ))}
            </View>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setShowOtpInput(false)}>
              <Text style={styles.changeNumber}>Change phone number</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <SimpleCountryPicker
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          visible={showCountryPicker}
          onClose={() => setShowCountryPicker(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  countryNameText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.textSecondary,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  otpContainer: {
    alignItems: 'center',
  },
  otpDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  changeNumber: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 