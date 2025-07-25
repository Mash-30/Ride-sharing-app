import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface Country {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
}

// Comprehensive list of countries with international calling codes
const countries: Country[] = [
  // North America
  { name: 'United States', code: 'US', callingCode: '1', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', callingCode: '1', flag: '🇨🇦' },
  { name: 'Mexico', code: 'MX', callingCode: '52', flag: '🇲🇽' },
  
  // Europe
  { name: 'United Kingdom', code: 'GB', callingCode: '44', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', callingCode: '49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', callingCode: '33', flag: '🇫🇷' },
  { name: 'Spain', code: 'ES', callingCode: '34', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', callingCode: '39', flag: '🇮🇹' },
  { name: 'Netherlands', code: 'NL', callingCode: '31', flag: '🇳🇱' },
  { name: 'Belgium', code: 'BE', callingCode: '32', flag: '🇧🇪' },
  { name: 'Switzerland', code: 'CH', callingCode: '41', flag: '🇨🇭' },
  { name: 'Austria', code: 'AT', callingCode: '43', flag: '🇦🇹' },
  { name: 'Sweden', code: 'SE', callingCode: '46', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', callingCode: '47', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', callingCode: '45', flag: '🇩🇰' },
  { name: 'Finland', code: 'FI', callingCode: '358', flag: '🇫🇮' },
  { name: 'Poland', code: 'PL', callingCode: '48', flag: '🇵🇱' },
  { name: 'Czech Republic', code: 'CZ', callingCode: '420', flag: '🇨🇿' },
  { name: 'Hungary', code: 'HU', callingCode: '36', flag: '🇭🇺' },
  { name: 'Romania', code: 'RO', callingCode: '40', flag: '🇷🇴' },
  { name: 'Bulgaria', code: 'BG', callingCode: '359', flag: '🇧🇬' },
  { name: 'Greece', code: 'GR', callingCode: '30', flag: '🇬🇷' },
  { name: 'Portugal', code: 'PT', callingCode: '351', flag: '🇵🇹' },
  { name: 'Ireland', code: 'IE', callingCode: '353', flag: '🇮🇪' },
  { name: 'Iceland', code: 'IS', callingCode: '354', flag: '🇮🇸' },
  { name: 'Luxembourg', code: 'LU', callingCode: '352', flag: '🇱🇺' },
  { name: 'Slovakia', code: 'SK', callingCode: '421', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', callingCode: '386', flag: '🇸🇮' },
  { name: 'Croatia', code: 'HR', callingCode: '385', flag: '🇭🇷' },
  { name: 'Serbia', code: 'RS', callingCode: '381', flag: '🇷🇸' },
  { name: 'Bosnia and Herzegovina', code: 'BA', callingCode: '387', flag: '🇧🇦' },
  { name: 'Montenegro', code: 'ME', callingCode: '382', flag: '🇲🇪' },
  { name: 'Albania', code: 'AL', callingCode: '355', flag: '🇦🇱' },
  { name: 'North Macedonia', code: 'MK', callingCode: '389', flag: '🇲🇰' },
  { name: 'Estonia', code: 'EE', callingCode: '372', flag: '🇪🇪' },
  { name: 'Latvia', code: 'LV', callingCode: '371', flag: '🇱🇻' },
  { name: 'Lithuania', code: 'LT', callingCode: '370', flag: '🇱🇹' },
  { name: 'Malta', code: 'MT', callingCode: '356', flag: '🇲🇹' },
  { name: 'Cyprus', code: 'CY', callingCode: '357', flag: '🇨🇾' },
  
  // Asia
  { name: 'China', code: 'CN', callingCode: '86', flag: '🇨🇳' },
  { name: 'Japan', code: 'JP', callingCode: '81', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', callingCode: '82', flag: '🇰🇷' },
  { name: 'India', code: 'IN', callingCode: '91', flag: '🇮🇳' },
  { name: 'Pakistan', code: 'PK', callingCode: '92', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'BD', callingCode: '880', flag: '🇧🇩' },
  { name: 'Sri Lanka', code: 'LK', callingCode: '94', flag: '🇱🇰' },
  { name: 'Nepal', code: 'NP', callingCode: '977', flag: '🇳🇵' },
  { name: 'Bhutan', code: 'BT', callingCode: '975', flag: '🇧🇹' },
  { name: 'Maldives', code: 'MV', callingCode: '960', flag: '🇲🇻' },
  { name: 'Thailand', code: 'TH', callingCode: '66', flag: '🇹🇭' },
  { name: 'Vietnam', code: 'VN', callingCode: '84', flag: '🇻🇳' },
  { name: 'Cambodia', code: 'KH', callingCode: '855', flag: '🇰🇭' },
  { name: 'Laos', code: 'LA', callingCode: '856', flag: '🇱🇦' },
  { name: 'Myanmar', code: 'MM', callingCode: '95', flag: '🇲🇲' },
  { name: 'Malaysia', code: 'MY', callingCode: '60', flag: '🇲🇾' },
  { name: 'Singapore', code: 'SG', callingCode: '65', flag: '🇸🇬' },
  { name: 'Indonesia', code: 'ID', callingCode: '62', flag: '🇮🇩' },
  { name: 'Philippines', code: 'PH', callingCode: '63', flag: '🇵🇭' },
  { name: 'Brunei', code: 'BN', callingCode: '673', flag: '🇧🇳' },
  { name: 'East Timor', code: 'TL', callingCode: '670', flag: '🇹🇱' },
  { name: 'Taiwan', code: 'TW', callingCode: '886', flag: '🇹🇼' },
  { name: 'Hong Kong', code: 'HK', callingCode: '852', flag: '🇭🇰' },
  { name: 'Macau', code: 'MO', callingCode: '853', flag: '🇲🇴' },
  { name: 'Mongolia', code: 'MN', callingCode: '976', flag: '🇲🇳' },
  { name: 'Kazakhstan', code: 'KZ', callingCode: '7', flag: '🇰🇿' },
  { name: 'Uzbekistan', code: 'UZ', callingCode: '998', flag: '🇺🇿' },
  { name: 'Kyrgyzstan', code: 'KG', callingCode: '996', flag: '🇰🇬' },
  { name: 'Tajikistan', code: 'TJ', callingCode: '992', flag: '🇹🇯' },
  { name: 'Turkmenistan', code: 'TM', callingCode: '993', flag: '🇹🇲' },
  { name: 'Afghanistan', code: 'AF', callingCode: '93', flag: '🇦🇫' },
  { name: 'Iran', code: 'IR', callingCode: '98', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', callingCode: '964', flag: '🇮🇶' },
  { name: 'Syria', code: 'SY', callingCode: '963', flag: '🇸🇾' },
  { name: 'Lebanon', code: 'LB', callingCode: '961', flag: '🇱🇧' },
  { name: 'Jordan', code: 'JO', callingCode: '962', flag: '🇯🇴' },
  { name: 'Israel', code: 'IL', callingCode: '972', flag: '🇮🇱' },
  { name: 'Palestine', code: 'PS', callingCode: '970', flag: '🇵🇸' },
  { name: 'Saudi Arabia', code: 'SA', callingCode: '966', flag: '🇸🇦' },
  { name: 'Yemen', code: 'YE', callingCode: '967', flag: '🇾🇪' },
  { name: 'Oman', code: 'OM', callingCode: '968', flag: '🇴🇲' },
  { name: 'United Arab Emirates', code: 'AE', callingCode: '971', flag: '🇦🇪' },
  { name: 'Qatar', code: 'QA', callingCode: '974', flag: '🇶🇦' },
  { name: 'Bahrain', code: 'BH', callingCode: '973', flag: '🇧🇭' },
  { name: 'Kuwait', code: 'KW', callingCode: '965', flag: '🇰🇼' },
  { name: 'Georgia', code: 'GE', callingCode: '995', flag: '🇬🇪' },
  { name: 'Armenia', code: 'AM', callingCode: '374', flag: '🇦🇲' },
  { name: 'Azerbaijan', code: 'AZ', callingCode: '994', flag: '🇦🇿' },
  { name: 'Turkey', code: 'TR', callingCode: '90', flag: '🇹🇷' },
  
  // Africa
  { name: 'South Africa', code: 'ZA', callingCode: '27', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'NG', callingCode: '234', flag: '🇳🇬' },
  { name: 'Egypt', code: 'EG', callingCode: '20', flag: '🇪🇬' },
  { name: 'Kenya', code: 'KE', callingCode: '254', flag: '🇰🇪' },
  { name: 'Ghana', code: 'GH', callingCode: '233', flag: '🇬🇭' },
  { name: 'Ethiopia', code: 'ET', callingCode: '251', flag: '🇪🇹' },
  { name: 'Tanzania', code: 'TZ', callingCode: '255', flag: '🇹🇿' },
  { name: 'Uganda', code: 'UG', callingCode: '256', flag: '🇺🇬' },
  { name: 'Morocco', code: 'MA', callingCode: '212', flag: '🇲🇦' },
  { name: 'Algeria', code: 'DZ', callingCode: '213', flag: '🇩🇿' },
  { name: 'Tunisia', code: 'TN', callingCode: '216', flag: '🇹🇳' },
  { name: 'Libya', code: 'LY', callingCode: '218', flag: '🇱🇾' },
  { name: 'Sudan', code: 'SD', callingCode: '249', flag: '🇸🇩' },
  { name: 'South Sudan', code: 'SS', callingCode: '211', flag: '🇸🇸' },
  { name: 'Chad', code: 'TD', callingCode: '235', flag: '🇹🇩' },
  { name: 'Niger', code: 'NE', callingCode: '227', flag: '🇳🇪' },
  { name: 'Mali', code: 'ML', callingCode: '223', flag: '🇲🇱' },
  { name: 'Burkina Faso', code: 'BF', callingCode: '226', flag: '🇧🇫' },
  { name: 'Senegal', code: 'SN', callingCode: '221', flag: '🇸🇳' },
  { name: 'Guinea', code: 'GN', callingCode: '224', flag: '🇬🇳' },
  { name: 'Sierra Leone', code: 'SL', callingCode: '232', flag: '🇸🇱' },
  { name: 'Liberia', code: 'LR', callingCode: '231', flag: '🇱🇷' },
  { name: 'Ivory Coast', code: 'CI', callingCode: '225', flag: '🇨🇮' },
  { name: 'Cameroon', code: 'CM', callingCode: '237', flag: '🇨🇲' },
  { name: 'Central African Republic', code: 'CF', callingCode: '236', flag: '🇨🇫' },
  { name: 'Gabon', code: 'GA', callingCode: '241', flag: '🇬🇦' },
  { name: 'Congo', code: 'CG', callingCode: '242', flag: '🇨🇬' },
  { name: 'Democratic Republic of Congo', code: 'CD', callingCode: '243', flag: '🇨🇩' },
  { name: 'Angola', code: 'AO', callingCode: '244', flag: '🇦🇴' },
  { name: 'Zambia', code: 'ZM', callingCode: '260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', callingCode: '263', flag: '🇿🇼' },
  { name: 'Botswana', code: 'BW', callingCode: '267', flag: '🇧🇼' },
  { name: 'Namibia', code: 'NA', callingCode: '264', flag: '🇳🇦' },
  { name: 'Lesotho', code: 'LS', callingCode: '266', flag: '🇱🇸' },
  { name: 'Eswatini', code: 'SZ', callingCode: '268', flag: '🇸🇿' },
  { name: 'Madagascar', code: 'MG', callingCode: '261', flag: '🇲🇬' },
  { name: 'Mauritius', code: 'MU', callingCode: '230', flag: '🇲🇺' },
  { name: 'Seychelles', code: 'SC', callingCode: '248', flag: '🇸🇨' },
  { name: 'Comoros', code: 'KM', callingCode: '269', flag: '🇰🇲' },
  { name: 'Djibouti', code: 'DJ', callingCode: '253', flag: '🇩🇯' },
  { name: 'Somalia', code: 'SO', callingCode: '252', flag: '🇸🇴' },
  { name: 'Eritrea', code: 'ER', callingCode: '291', flag: '🇪🇷' },
  { name: 'Burundi', code: 'BI', callingCode: '257', flag: '🇧🇮' },
  { name: 'Rwanda', code: 'RW', callingCode: '250', flag: '🇷🇼' },
  { name: 'Malawi', code: 'MW', callingCode: '265', flag: '🇲🇼' },
  { name: 'Mozambique', code: 'MZ', callingCode: '258', flag: '🇲🇿' },
  { name: 'Cape Verde', code: 'CV', callingCode: '238', flag: '🇨🇻' },
  { name: 'Guinea-Bissau', code: 'GW', callingCode: '245', flag: '🇬🇼' },
  { name: 'Equatorial Guinea', code: 'GQ', callingCode: '240', flag: '🇬🇶' },
  { name: 'São Tomé and Príncipe', code: 'ST', callingCode: '239', flag: '🇸🇹' },
  { name: 'Togo', code: 'TG', callingCode: '228', flag: '🇹🇬' },
  { name: 'Benin', code: 'BJ', callingCode: '229', flag: '🇧🇯' },
  { name: 'Gambia', code: 'GM', callingCode: '220', flag: '🇬🇲' },
  
  // South America
  { name: 'Brazil', code: 'BR', callingCode: '55', flag: '🇧🇷' },
  { name: 'Argentina', code: 'AR', callingCode: '54', flag: '🇦🇷' },
  { name: 'Chile', code: 'CL', callingCode: '56', flag: '🇨🇱' },
  { name: 'Colombia', code: 'CO', callingCode: '57', flag: '🇨🇴' },
  { name: 'Peru', code: 'PE', callingCode: '51', flag: '🇵🇪' },
  { name: 'Venezuela', code: 'VE', callingCode: '58', flag: '🇻🇪' },
  { name: 'Ecuador', code: 'EC', callingCode: '593', flag: '🇪🇨' },
  { name: 'Bolivia', code: 'BO', callingCode: '591', flag: '🇧🇴' },
  { name: 'Paraguay', code: 'PY', callingCode: '595', flag: '🇵🇾' },
  { name: 'Uruguay', code: 'UY', callingCode: '598', flag: '🇺🇾' },
  { name: 'Guyana', code: 'GY', callingCode: '592', flag: '🇬🇾' },
  { name: 'Suriname', code: 'SR', callingCode: '597', flag: '🇸🇷' },
  { name: 'French Guiana', code: 'GF', callingCode: '594', flag: '🇬🇫' },
  
  // Oceania
  { name: 'Australia', code: 'AU', callingCode: '61', flag: '🇦🇺' },
  { name: 'New Zealand', code: 'NZ', callingCode: '64', flag: '🇳🇿' },
  { name: 'Papua New Guinea', code: 'PG', callingCode: '675', flag: '🇵🇬' },
  { name: 'Fiji', code: 'FJ', callingCode: '679', flag: '🇫🇯' },
  { name: 'Solomon Islands', code: 'SB', callingCode: '677', flag: '🇸🇧' },
  { name: 'Vanuatu', code: 'VU', callingCode: '678', flag: '🇻🇺' },
  { name: 'New Caledonia', code: 'NC', callingCode: '687', flag: '🇳🇨' },
  { name: 'French Polynesia', code: 'PF', callingCode: '689', flag: '🇵🇫' },
  { name: 'Samoa', code: 'WS', callingCode: '685', flag: '🇼🇸' },
  { name: 'Tonga', code: 'TO', callingCode: '676', flag: '🇹🇴' },
  { name: 'Kiribati', code: 'KI', callingCode: '686', flag: '🇰🇮' },
  { name: 'Tuvalu', code: 'TV', callingCode: '688', flag: '🇹🇻' },
  { name: 'Nauru', code: 'NR', callingCode: '674', flag: '🇳🇷' },
  { name: 'Palau', code: 'PW', callingCode: '680', flag: '🇵🇼' },
  { name: 'Marshall Islands', code: 'MH', callingCode: '692', flag: '🇲🇭' },
  { name: 'Micronesia', code: 'FM', callingCode: '691', flag: '🇫🇲' },
  
  // Caribbean
  { name: 'Cuba', code: 'CU', callingCode: '53', flag: '🇨🇺' },
  { name: 'Jamaica', code: 'JM', callingCode: '1876', flag: '🇯🇲' },
  { name: 'Haiti', code: 'HT', callingCode: '509', flag: '🇭🇹' },
  { name: 'Dominican Republic', code: 'DO', callingCode: '1809', flag: '🇩🇴' },
  { name: 'Puerto Rico', code: 'PR', callingCode: '1787', flag: '🇵🇷' },
  { name: 'Trinidad and Tobago', code: 'TT', callingCode: '1868', flag: '🇹🇹' },
  { name: 'Barbados', code: 'BB', callingCode: '1246', flag: '🇧🇧' },
  { name: 'Bahamas', code: 'BS', callingCode: '1242', flag: '🇧🇸' },
  { name: 'Grenada', code: 'GD', callingCode: '1473', flag: '🇬🇩' },
  { name: 'Saint Lucia', code: 'LC', callingCode: '1758', flag: '🇱🇨' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', callingCode: '1784', flag: '🇻🇨' },
  { name: 'Antigua and Barbuda', code: 'AG', callingCode: '1268', flag: '🇦🇬' },
  { name: 'Saint Kitts and Nevis', code: 'KN', callingCode: '1869', flag: '🇰🇳' },
  { name: 'Dominica', code: 'DM', callingCode: '1767', flag: '🇩🇲' },
  { name: 'Belize', code: 'BZ', callingCode: '501', flag: '🇧🇿' },
  { name: 'El Salvador', code: 'SV', callingCode: '503', flag: '🇸🇻' },
  { name: 'Honduras', code: 'HN', callingCode: '504', flag: '🇭🇳' },
  { name: 'Nicaragua', code: 'NI', callingCode: '505', flag: '🇳🇮' },
  { name: 'Costa Rica', code: 'CR', callingCode: '506', flag: '🇨🇷' },
  { name: 'Panama', code: 'PA', callingCode: '507', flag: '🇵🇦' },
  { name: 'Guatemala', code: 'GT', callingCode: '502', flag: '🇬🇹' },
  
  // Central Asia
  { name: 'Russia', code: 'RU', callingCode: '7', flag: '🇷🇺' },
  { name: 'Ukraine', code: 'UA', callingCode: '380', flag: '🇺🇦' },
  { name: 'Belarus', code: 'BY', callingCode: '375', flag: '🇧🇾' },
  { name: 'Moldova', code: 'MD', callingCode: '373', flag: '🇲🇩' },
  
  // Other territories
  { name: 'Greenland', code: 'GL', callingCode: '299', flag: '🇬🇱' },
  { name: 'Faroe Islands', code: 'FO', callingCode: '298', flag: '🇫🇴' },
  { name: 'Falkland Islands', code: 'FK', callingCode: '500', flag: '🇫🇰' },
  { name: 'French Southern Territories', code: 'TF', callingCode: '262', flag: '🇹🇫' },
  { name: 'British Indian Ocean Territory', code: 'IO', callingCode: '246', flag: '🇮🇴' },
  { name: 'Pitcairn Islands', code: 'PN', callingCode: '64', flag: '🇵🇳' },
  { name: 'Cocos Islands', code: 'CC', callingCode: '61', flag: '🇨🇨' },
  { name: 'Christmas Island', code: 'CX', callingCode: '61', flag: '🇨🇽' },
  { name: 'Norfolk Island', code: 'NF', callingCode: '672', flag: '🇳🇫' },
  { name: 'Tokelau', code: 'TK', callingCode: '690', flag: '🇹🇰' },
  { name: 'Niue', code: 'NU', callingCode: '683', flag: '🇳🇺' },
  { name: 'Cook Islands', code: 'CK', callingCode: '682', flag: '🇨🇰' },
  { name: 'Wallis and Futuna', code: 'WF', callingCode: '681', flag: '🇼🇫' },
  { name: 'American Samoa', code: 'AS', callingCode: '1684', flag: '🇦🇸' },
  { name: 'Guam', code: 'GU', callingCode: '1671', flag: '🇬🇺' },
  { name: 'Northern Mariana Islands', code: 'MP', callingCode: '1670', flag: '🇲🇵' },
  { name: 'U.S. Virgin Islands', code: 'VI', callingCode: '1340', flag: '🇻🇮' },
  { name: 'British Virgin Islands', code: 'VG', callingCode: '1284', flag: '🇻🇬' },
  { name: 'Anguilla', code: 'AI', callingCode: '1264', flag: '🇦🇮' },
  { name: 'Montserrat', code: 'MS', callingCode: '1664', flag: '🇲🇸' },
  { name: 'Cayman Islands', code: 'KY', callingCode: '1345', flag: '🇰🇾' },
  { name: 'Turks and Caicos Islands', code: 'TC', callingCode: '1649', flag: '🇹🇨' },
  { name: 'Bermuda', code: 'BM', callingCode: '1441', flag: '🇧🇲' },
  { name: 'Aruba', code: 'AW', callingCode: '297', flag: '🇦🇼' },
  { name: 'Curaçao', code: 'CW', callingCode: '599', flag: '🇨🇼' },
  { name: 'Sint Maarten', code: 'SX', callingCode: '1721', flag: '🇸🇽' },
  { name: 'Saint Martin', code: 'MF', callingCode: '590', flag: '🇲🇫' },
  { name: 'Saint Barthélemy', code: 'BL', callingCode: '590', flag: '🇧🇱' },
  { name: 'Guadeloupe', code: 'GP', callingCode: '590', flag: '🇬🇵' },
  { name: 'Martinique', code: 'MQ', callingCode: '596', flag: '🇲🇶' },
  { name: 'Réunion', code: 'RE', callingCode: '262', flag: '🇷🇪' },
  { name: 'Mayotte', code: 'YT', callingCode: '262', flag: '🇾🇹' },
  { name: 'Saint Pierre and Miquelon', code: 'PM', callingCode: '508', flag: '🇵🇲' },
  { name: 'Gibraltar', code: 'GI', callingCode: '350', flag: '🇬🇮' },
  { name: 'Andorra', code: 'AD', callingCode: '376', flag: '🇦🇩' },
  { name: 'Monaco', code: 'MC', callingCode: '377', flag: '🇲🇨' },
  { name: 'Liechtenstein', code: 'LI', callingCode: '423', flag: '🇱🇮' },
  { name: 'San Marino', code: 'SM', callingCode: '378', flag: '🇸🇲' },
  { name: 'Vatican City', code: 'VA', callingCode: '379', flag: '🇻🇦' },
  { name: 'Kosovo', code: 'XK', callingCode: '383', flag: '🇽🇰' },
];

interface ComprehensiveCountryPickerProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  visible: boolean;
  onClose: () => void;
}

export default function ComprehensiveCountryPicker({
  selectedCountry,
  onSelectCountry,
  visible,
  onClose,
}: ComprehensiveCountryPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.callingCode.includes(searchQuery)
  );

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Country</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.countryItem}
              onPress={() => handleSelectCountry(item)}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.callingCode}>+{item.callingCode}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  searchInput: {
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  callingCode: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
}); 