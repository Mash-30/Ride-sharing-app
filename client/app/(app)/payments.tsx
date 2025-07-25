import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { PaymentMethod, Transaction } from '../../services/api';
import apiService from '../../services/api';

export default function PaymentsScreen() {
  const [activeTab, setActiveTab] = useState('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'methods') {
        const methods = await apiService.getPaymentMethods();
        setPaymentMethods(methods);
      } else {
        const txn = await apiService.getTransactions();
        setTransactions(txn);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity style={styles.paymentMethodCard}>
      <View style={styles.paymentMethodInfo}>
        <FontAwesome5
          name="credit-card"
          size={24}
          color={Colors.textPrimary}
          style={styles.paymentIcon}
        />
        <View>
          <Text style={styles.paymentMethodName}>
            {item.cardBrand.charAt(0).toUpperCase() + item.cardBrand.slice(1)} ending in {item.last4}
          </Text>
          {item.isDefault && (
            <Text style={styles.defaultLabel}>Default Payment Method</Text>
          )}
        </View>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <FontAwesome5
            name={item.type === 'ride' ? 'car' : 'gift'}
            size={20}
            color={Colors.textPrimary}
          />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text
            style={[
              styles.transactionAmount,
              { color: item.amount > 0 ? Colors.success : Colors.textPrimary },
            ]}>
            {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <Text style={[styles.transactionStatus, { 
            color: item.status === 'completed' ? Colors.success : 
                   item.status === 'pending' ? Colors.warning : Colors.error 
          }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'methods' && styles.activeTab]}
          onPress={() => setActiveTab('methods')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'methods' && styles.activeTabText,
            ]}>
            Payment Methods
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'methods' ? (
        <View style={styles.content}>
          <FlatList
            data={paymentMethods}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.paymentMethodsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="credit-card" size={50} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No payment methods added</Text>
              </View>
            }
          />
          <TouchableOpacity style={styles.addButton}>
            <FontAwesome5 name="plus" size={16} color={Colors.background} />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.transactionsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="receipt" size={50} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  paymentMethodsList: {
    padding: 20,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    marginRight: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  defaultLabel: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    margin: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  transactionsList: {
    padding: 20,
  },
  transactionCard: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 15,
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textSecondary,
  },
}); 