import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Switch,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

const MOCK_USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  rating: 4.85,
  totalRides: 48,
};

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const menuItems = [
    {
      id: 'favorites',
      icon: 'heart',
      title: 'Saved Places',
      subtitle: 'Manage your favorite locations',
    },
    {
      id: 'payment',
      icon: 'credit-card',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
    },
    {
      id: 'safety',
      icon: 'shield-alt',
      title: 'Safety',
      subtitle: 'Emergency contacts and safety features',
    },
    {
      id: 'support',
      icon: 'headset',
      title: 'Help & Support',
      subtitle: 'Contact support, FAQ',
    },
    {
      id: 'about',
      icon: 'info-circle',
      title: 'About',
      subtitle: 'Terms of service, Privacy policy',
    },
  ];

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    router.replace('/(auth)/splash');
  };

  const renderMenuItem = ({ id, icon, title, subtitle }) => (
    <TouchableOpacity key={id} style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <FontAwesome5 name={icon} size={20} color={Colors.textPrimary} style={styles.menuIcon} />
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{MOCK_USER.name}</Text>
            <Text style={styles.profileEmail}>{MOCK_USER.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome5 name="edit" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{MOCK_USER.totalRides}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Text style={styles.statValue}>{MOCK_USER.rating}</Text>
              <FontAwesome5 name="star" size={12} color={Colors.primary} solid style={styles.ratingIcon} />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <FontAwesome5 name="bell" size={20} color={Colors.textPrimary} style={styles.preferenceIcon} />
            <Text style={styles.preferenceText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.divider, true: Colors.primary }}
            thumbColor={Colors.background}
          />
        </View>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <FontAwesome5 name="map-marker-alt" size={20} color={Colors.textPrimary} style={styles.preferenceIcon} />
            <Text style={styles.preferenceText}>Location Services</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: Colors.divider, true: Colors.primary }}
            thumbColor={Colors.background}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map(renderMenuItem)}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <FontAwesome5 name="sign-out-alt" size={20} color={Colors.error} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  profileSection: {
    backgroundColor: Colors.background,
    padding: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: Colors.background,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.divider,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginLeft: 5,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIcon: {
    marginRight: 15,
  },
  preferenceText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  signOutText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
}); 