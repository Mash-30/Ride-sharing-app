import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiService from '../services/api';
import { Colors } from '../constants/Colors';

export default function ApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testHealthCheck = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing API health check...');
      const response = await apiService.healthCheck();
      console.log('✅ Health check response:', response);
      setResult(JSON.stringify(response, null, 2));
      Alert.alert('Success', 'API connection working!');
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setResult(`Error: ${error.message}`);
      Alert.alert('Error', `API connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing auth endpoint...');
      const response = await apiService.sendOtp('+1234567890');
      console.log('✅ Auth test response:', response);
      setResult(JSON.stringify(response, null, 2));
      Alert.alert('Success', 'Auth endpoint working!');
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      setResult(`Error: ${error.message}`);
      Alert.alert('Error', `Auth endpoint failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testHealthCheck}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Health Check'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testAuthEndpoint}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Auth Endpoint'}
        </Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
}); 