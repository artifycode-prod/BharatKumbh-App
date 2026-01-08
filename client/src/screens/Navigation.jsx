import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../components/Header';
import { styles } from '../styles/styles';
import { getCurrentPosition } from '../utils/location';

// Location types
const LOCATION_TYPES = {
	GHAT: 'ghat',
	TEMPLE: 'temple',
	CAMP: 'camp',
	MEDICAL: 'medical',
	FACILITY: 'facility'
};

// Comprehensive Nashik locations with types and crowd density
const NASHIK_LOCATIONS = [
	// Ghats
	{
		id: 'ramkund',
		name: 'Ramkund',
		type: LOCATION_TYPES.GHAT,
		icon: '🕉️',
		coordinates: { latitude: 19.9636, longitude: 73.7898 },
		crowdDensity: 75, // 0-100 percentage
		crowdLevel: 'High',
		description: 'Sacred bathing ghat on Godavari River',
		capacity: 5000,
		currentOccupancy: 3750
	},
	{
		id: 'panchavati',
		name: 'Panchavati Ghat',
		type: LOCATION_TYPES.GHAT,
		icon: '🌊',
		coordinates: { latitude: 19.9650, longitude: 73.7900 },
		crowdDensity: 85,
		crowdLevel: 'Very High',
		description: 'Famous ghat for holy dip',
		capacity: 8000,
		currentOccupancy: 6800
	},
	{
		id: 'kapilatirth',
		name: 'Kapila Tirth',
		type: LOCATION_TYPES.GHAT,
		icon: '💧',
		coordinates: { latitude: 19.9680, longitude: 73.7920 },
		crowdDensity: 60,
		crowdLevel: 'Moderate',
		description: 'Sacred water tank',
		capacity: 3000,
		currentOccupancy: 1800
	},
	// Temples
	{
		id: 'kalaram',
		name: 'Kalaram Temple',
		type: LOCATION_TYPES.TEMPLE,
		icon: '🛕',
		coordinates: { latitude: 19.9600, longitude: 73.7870 },
		crowdDensity: 45,
		crowdLevel: 'Low',
		description: 'Ancient black stone Ram temple',
		capacity: 2000,
		currentOccupancy: 900
	},
	{
		id: 'trimbakeshwar',
		name: 'Trimbakeshwar Temple',
		type: LOCATION_TYPES.TEMPLE,
		icon: '🔱',
		coordinates: { latitude: 19.9330, longitude: 73.5300 },
		crowdDensity: 90,
		crowdLevel: 'Very High',
		description: 'One of the 12 Jyotirlingas',
		capacity: 10000,
		currentOccupancy: 9000
	},
	{
		id: 'muktidham',
		name: 'Muktidham Temple',
		type: LOCATION_TYPES.TEMPLE,
		icon: '⛩️',
		coordinates: { latitude: 19.9500, longitude: 73.8000 },
		crowdDensity: 55,
		crowdLevel: 'Moderate',
		description: 'White marble temple complex',
		capacity: 5000,
		currentOccupancy: 2750
	},
	{
		id: 'sitagufa',
		name: 'Sita Gufa',
		type: LOCATION_TYPES.TEMPLE,
		icon: '🕳️',
		coordinates: { latitude: 19.9580, longitude: 73.7850 },
		crowdDensity: 30,
		crowdLevel: 'Low',
		description: 'Cave where Sita stayed during exile',
		capacity: 500,
		currentOccupancy: 150
	},
	// Camps
	{
		id: 'camp1',
		name: 'Pilgrim Camp A',
		type: LOCATION_TYPES.CAMP,
		icon: '⛺',
		coordinates: { latitude: 19.9700, longitude: 73.7950 },
		crowdDensity: 40,
		crowdLevel: 'Low',
		description: 'Main accommodation camp',
		capacity: 2000,
		currentOccupancy: 800
	},
	{
		id: 'camp2',
		name: 'Pilgrim Camp B',
		type: LOCATION_TYPES.CAMP,
		icon: '⛺',
		coordinates: { latitude: 19.9750, longitude: 73.8000 },
		crowdDensity: 65,
		crowdLevel: 'Moderate',
		description: 'Secondary accommodation camp',
		capacity: 1500,
		currentOccupancy: 975
	},
	{
		id: 'camp3',
		name: 'Volunteer Camp',
		type: LOCATION_TYPES.CAMP,
		icon: '🏕️',
		coordinates: { latitude: 19.9550, longitude: 73.7820 },
		crowdDensity: 50,
		crowdLevel: 'Moderate',
		description: 'Volunteer accommodation',
		capacity: 500,
		currentOccupancy: 250
	},
	// Medical Facilities
	{
		id: 'medical1',
		name: 'Medical Tent - Ramkund',
		type: LOCATION_TYPES.MEDICAL,
		icon: '🏥',
		coordinates: { latitude: 19.9640, longitude: 73.7895 },
		crowdDensity: 25,
		crowdLevel: 'Low',
		description: '24/7 medical assistance',
		capacity: 50,
		currentOccupancy: 12
	},
	{
		id: 'medical2',
		name: 'Medical Tent - Panchavati',
		type: LOCATION_TYPES.MEDICAL,
		icon: '🏥',
		coordinates: { latitude: 19.9655, longitude: 73.7905 },
		crowdDensity: 35,
		crowdLevel: 'Low',
		description: 'Emergency medical services',
		capacity: 50,
		currentOccupancy: 17
	},
	{
		id: 'medical3',
		name: 'Medical Center - Main',
		type: LOCATION_TYPES.MEDICAL,
		icon: '🏥',
		coordinates: { latitude: 19.9600, longitude: 73.7850 },
		crowdDensity: 20,
		crowdLevel: 'Low',
		description: 'Primary medical facility',
		capacity: 100,
		currentOccupancy: 20
	},
	// Facilities
	{
		id: 'facility1',
		name: 'Food Court - Main',
		type: LOCATION_TYPES.FACILITY,
		icon: '🍽️',
		coordinates: { latitude: 19.9620, longitude: 73.7880 },
		crowdDensity: 70,
		crowdLevel: 'High',
		description: 'Main food distribution center',
		capacity: 1000,
		currentOccupancy: 700
	},
	{
		id: 'facility2',
		name: 'Water Station A',
		type: LOCATION_TYPES.FACILITY,
		icon: '💧',
		coordinates: { latitude: 19.9660, longitude: 73.7910 },
		crowdDensity: 50,
		crowdLevel: 'Moderate',
		description: 'Drinking water facility',
		capacity: 500,
		currentOccupancy: 250
	},
	{
		id: 'facility3',
		name: 'Restroom Block 1',
		type: LOCATION_TYPES.FACILITY,
		icon: '🚻',
		coordinates: { latitude: 19.9610, longitude: 73.7875 },
		crowdDensity: 60,
		crowdLevel: 'Moderate',
		description: 'Public restroom facilities',
		capacity: 200,
		currentOccupancy: 120
	},
	{
		id: 'facility4',
		name: 'Information Center',
		type: LOCATION_TYPES.FACILITY,
		icon: 'ℹ️',
		coordinates: { latitude: 19.9590, longitude: 73.7860 },
		crowdDensity: 30,
		crowdLevel: 'Low',
		description: 'Tourist information and help desk',
		capacity: 100,
		currentOccupancy: 30
	}
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Radius of the Earth in km
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a = 
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in km
	
	if (distance < 1) {
		return `${Math.round(distance * 1000)} m`;
	}
	return `${distance.toFixed(1)} km`;
};

// Calculate estimated time based on distance and crowd density
const calculateTime = (distance, crowdDensity) => {
	const baseSpeed = 4; // km/h walking speed
	const crowdFactor = 1 + (crowdDensity / 100); // Slower in crowds
	const speed = baseSpeed / crowdFactor;
	const timeHours = parseFloat(distance.replace(' km', '').replace(' m', '')) / (speed * (distance.includes('m') ? 0.001 : 1));
	const timeMinutes = Math.round(timeHours * 60);
	return `${timeMinutes} min`;
};

// Get route suggestions based on crowd density
const getRouteSuggestions = (destination, currentLocation, allLocations) => {
	const routes = [];
	
	// Direct route
	const directDistance = calculateDistance(
		currentLocation.latitude,
		currentLocation.longitude,
		destination.coordinates.latitude,
		destination.coordinates.longitude
	);
	
	routes.push({
		type: 'direct',
		name: 'Direct Route',
		distance: directDistance,
		time: calculateTime(directDistance, destination.crowdDensity),
		crowdLevel: destination.crowdLevel,
		waypoints: [],
		totalCrowd: destination.crowdDensity
	});
	
	// Find alternate routes through less crowded areas
	const nearbyLocations = allLocations
		.filter(loc => 
			loc.id !== destination.id &&
			loc.crowdDensity < destination.crowdDensity &&
			loc.type !== LOCATION_TYPES.MEDICAL
		)
		.sort((a, b) => a.crowdDensity - b.crowdDensity)
		.slice(0, 3);
	
	nearbyLocations.forEach(waypoint => {
		const dist1 = calculateDistance(
			currentLocation.latitude,
			currentLocation.longitude,
			waypoint.coordinates.latitude,
			waypoint.coordinates.longitude
		);
		const dist2 = calculateDistance(
			waypoint.coordinates.latitude,
			waypoint.coordinates.longitude,
			destination.coordinates.latitude,
			destination.coordinates.longitude
		);
		
		const totalDist = parseFloat(dist1.replace(' km', '').replace(' m', '')) + 
			parseFloat(dist2.replace(' km', '').replace(' m', ''));
		const totalDistStr = totalDist < 1 ? `${Math.round(totalDist * 1000)} m` : `${totalDist.toFixed(1)} km`;
		
		const avgCrowd = (waypoint.crowdDensity + destination.crowdDensity) / 2;
		
		routes.push({
			type: 'alternate',
			name: `Via ${waypoint.name}`,
			distance: totalDistStr,
			time: calculateTime(totalDistStr, avgCrowd),
			crowdLevel: avgCrowd < 40 ? 'Low' : avgCrowd < 70 ? 'Moderate' : 'High',
			waypoints: [waypoint],
			totalCrowd: avgCrowd
		});
	});
	
	// Sort by total crowd density (prefer less crowded)
	return routes.sort((a, b) => a.totalCrowd - b.totalCrowd);
};

// Open Google Maps with route
const openGoogleMaps = (destination, waypoints = []) => {
	const { latitude, longitude } = destination.coordinates;
	
	let url;
	if (waypoints.length > 0) {
		const waypoint = waypoints[0];
		// Google Maps with waypoints
		url = `https://www.google.com/maps/dir/?api=1&origin=${waypoint.coordinates.latitude},${waypoint.coordinates.longitude}&destination=${latitude},${longitude}&waypoints=${waypoint.coordinates.latitude},${waypoint.coordinates.longitude}`;
	} else {
		// Direct route
		url = Platform.select({
			ios: `maps://app?daddr=${latitude},${longitude}&dirflg=w`,
			android: `google.navigation:q=${latitude},${longitude}`,
		});
	}
	
	Linking.canOpenURL(url).then(supported => {
		if (supported) {
			Linking.openURL(url);
		} else {
			// Fallback to Google Maps web
			const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
			Linking.openURL(webUrl);
		}
	}).catch(err => {
		console.error('Error opening navigation:', err);
		Alert.alert('Error', 'Could not open navigation app. Please install Google Maps.');
	});
};

// Open Google Maps with all locations marked
const openGoogleMapsWithAllLocations = (locations, currentLocation) => {
	if (!currentLocation) {
		Alert.alert('Location Required', 'Please wait for location to load.');
		return;
	}
	
	// Create a Google Maps URL with all locations
	// Using Google Maps search with multiple locations
	const allLocations = locations.map(loc => 
		`${loc.coordinates.latitude},${loc.coordinates.longitude}`
	).join('/');
	
	// Open Google Maps centered on current location with nearby places
	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${currentLocation.latitude},${currentLocation.longitude}`;
	
	Linking.canOpenURL(mapUrl).then(supported => {
		if (supported) {
			Linking.openURL(mapUrl);
		} else {
			// Fallback to web version
			const webUrl = `https://www.google.com/maps/@${currentLocation.latitude},${currentLocation.longitude},14z`;
			Linking.openURL(webUrl);
		}
	}).catch(err => {
		console.error('Error opening maps:', err);
		Alert.alert('Error', 'Could not open maps. Please install Google Maps.');
	});
};

// Open Google Maps with all markers
const openGoogleMapsWithMarkers = (locations, currentLocation) => {
	if (!currentLocation) return;
	
	const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${locations[0].coordinates.latitude},${locations[0].coordinates.longitude}`;
	
	Linking.openURL(url);
};

export const Navigation = ({goHome}) => {
	const [currentLocation, setCurrentLocation] = useState(null);
	const [loadingLocation, setLoadingLocation] = useState(true);
	const [selectedDestination, setSelectedDestination] = useState(null);
	const [showMap, setShowMap] = useState(false);
	const [selectedType, setSelectedType] = useState('all'); // 'all', 'ghat', 'temple', 'camp', 'medical', 'facility'
	const [routeSuggestions, setRouteSuggestions] = useState([]);
	const [showRoutes, setShowRoutes] = useState(false);

	useEffect(() => {
		loadCurrentLocation();
	}, []);

	const loadCurrentLocation = async () => {
		try {
			setLoadingLocation(true);
			const location = await getCurrentPosition();
			setCurrentLocation(location);
			
			// Calculate distances for all locations
			const locationsWithDistance = NASHIK_LOCATIONS.map(loc => ({
				...loc,
				calculatedDistance: calculateDistance(
					location.latitude,
					location.longitude,
					loc.coordinates.latitude,
					loc.coordinates.longitude
				)
			}));
			
			// Sort by distance
			locationsWithDistance.sort((a, b) => {
				const distA = parseFloat(a.calculatedDistance.replace(' km', '').replace(' m', ''));
				const distB = parseFloat(b.calculatedDistance.replace(' km', '').replace(' m', ''));
				return distA - distB;
			});
		} catch (error) {
			console.error('Error loading location:', error);
			setCurrentLocation({ latitude: 19.9975, longitude: 73.7898 });
		} finally {
			setLoadingLocation(false);
		}
	};

	const handleDestinationPress = (destination) => {
		setSelectedDestination(destination);
		
		if (currentLocation) {
			const routes = getRouteSuggestions(destination, currentLocation, NASHIK_LOCATIONS);
			setRouteSuggestions(routes);
			setShowRoutes(true);
		} else {
			Alert.alert(
				destination.name,
				`${destination.description}\n\nCrowd Level: ${destination.crowdLevel} (${destination.crowdDensity}%)\nOccupancy: ${destination.currentOccupancy}/${destination.capacity}`,
				[
					{ text: 'Cancel', style: 'cancel' },
					{ 
						text: 'Navigate', 
						onPress: () => openGoogleMaps(destination),
						style: 'default'
					}
				]
			);
		}
	};

	const getFilteredLocations = () => {
		if (selectedType === 'all') return NASHIK_LOCATIONS;
		return NASHIK_LOCATIONS.filter(loc => loc.type === selectedType);
	};

	const getCrowdColor = (density) => {
		if (density < 40) return '#10B981'; // Green - Low
		if (density < 70) return '#F59E0B'; // Orange - Moderate
		return '#EF4444'; // Red - High
	};

	const getTypeIcon = (type) => {
		const icons = {
			[LOCATION_TYPES.GHAT]: '🌊',
			[LOCATION_TYPES.TEMPLE]: '🛕',
			[LOCATION_TYPES.CAMP]: '⛺',
			[LOCATION_TYPES.MEDICAL]: '🏥',
			[LOCATION_TYPES.FACILITY]: '🏢'
		};
		return icons[type] || '📍';
	};

	return (
		<ScrollView 
			contentContainerStyle={[styles.screenPad, {paddingBottom: 160}]}
			showsVerticalScrollIndicator={false}
		>
			<Header title="Nashik Navigation" icon="🧭" accent="orange" onBack={goHome} />

			{/* Current location card */}
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Current Location</Text>
				{loadingLocation ? (
					<View style={{alignItems: 'center', marginTop: 12}}>
						<ActivityIndicator size="small" color="#F59E0B" />
						<Text style={[styles.rowSubtitle, {marginTop: 8}]}>Getting your location...</Text>
					</View>
				) : (
					<>
						<Text style={styles.rowSubtitle}>
							{currentLocation 
								? `Lat: ${currentLocation.latitude.toFixed(4)}, Lng: ${currentLocation.longitude.toFixed(4)}`
								: 'Near Panchavati, Ramkund Entrance'}
						</Text>
						<View style={{alignItems: 'center', marginTop: 12}}>
							<LinearGradient colors={["#FFB74D", "#FF9800"]} style={styles.round64}>
								<Text style={styles.round64Text}>📍</Text>
							</LinearGradient>
						</View>
						<TouchableOpacity 
							onPress={loadCurrentLocation}
							style={{marginTop: 8, alignSelf: 'center'}}
							activeOpacity={0.7}
						>
							<Text style={[styles.textOrange, {fontSize: 12}]}>🔄 Refresh Location</Text>
						</TouchableOpacity>
					</>
				)}
			</View>

			{/* Filter by Location Type */}
			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Filter Locations</Text>
				<View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8}}>
					{['all', 'ghat', 'temple', 'camp', 'medical', 'facility'].map((type) => (
						<TouchableOpacity
							key={type}
							onPress={() => setSelectedType(type)}
							activeOpacity={0.7}
							style={[
								styles.chip,
								selectedType === type && styles.chipActive,
								{marginBottom: 0}
							]}
						>
							<Text style={selectedType === type ? styles.chipTextActive : styles.chipText}>
								{type === 'all' ? '📍 All' : 
								 type === 'ghat' ? '🌊 Ghats' :
								 type === 'temple' ? '🛕 Temples' :
								 type === 'camp' ? '⛺ Camps' :
								 type === 'medical' ? '🏥 Medical' :
								 '🏢 Facilities'}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Locations List */}
			<View style={styles.card}>
				<Text style={styles.sectionTitle}>
					{selectedType === 'all' ? 'All Locations' :
					 selectedType === 'ghat' ? 'Ghats' :
					 selectedType === 'temple' ? 'Temples' :
					 selectedType === 'camp' ? 'Camps' :
					 selectedType === 'medical' ? 'Medical Facilities' :
					 'Other Facilities'} ({getFilteredLocations().length})
				</Text>
				{getFilteredLocations().map((loc, index) => (
					<TouchableOpacity
						key={loc.id}
						onPress={() => handleDestinationPress(loc)}
						activeOpacity={0.7}
						style={[styles.listRow, index > 0 && {marginTop: 12}]}
					>
						<View style={styles.round64Light}>
							<Text style={styles.round64Text}>{loc.icon}</Text>
						</View>
						<View style={{flex: 1, marginLeft: 12}}>
							<Text style={styles.rowTitle}>{loc.name}</Text>
							<Text style={styles.rowSubtitle} numberOfLines={1}>{loc.description}</Text>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
								<Text style={[styles.rowSubtitle, {fontSize: 11, color: '#6B7280'}]}>
									{loc.calculatedDistance || 'Calculating...'} • 
								</Text>
								<View style={{
									backgroundColor: getCrowdColor(loc.crowdDensity),
									paddingHorizontal: 6,
									paddingVertical: 2,
									borderRadius: 4,
									marginLeft: 4
								}}>
									<Text style={{color: 'white', fontSize: 10, fontWeight: '600'}}>
										{loc.crowdLevel} ({loc.crowdDensity}%)
									</Text>
								</View>
							</View>
						</View>
						<View style={styles.round32}>
							<Text style={styles.round32Text}>➡️</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>

			{/* Quick Actions */}
			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Quick Actions</Text>
				<TouchableOpacity 
					activeOpacity={0.9} 
					style={[styles.primaryBtn, {width: '100%', marginTop: 8}]} 
					onPress={() => {
						if (currentLocation) {
							openGoogleMapsWithMarkers(NASHIK_LOCATIONS, currentLocation);
						} else {
							Alert.alert('Location Required', 'Please wait for location to load.');
						}
					}}
				>
					<Text style={styles.primaryBtnText}>🗺️ View All on Google Maps</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					activeOpacity={0.9} 
					style={[styles.primaryBtn, {width: '100%', marginTop: 8, backgroundColor: '#10B981'}]} 
					onPress={() => setShowMap(!showMap)}
				>
					<Text style={styles.primaryBtnText}>{showMap ? 'Hide' : 'Show'} Map View</Text>
				</TouchableOpacity>
			</View>

			{/* Nashik Kumbh Mela Live Map - Redirect to Google Maps */}
			{showMap && (
				<View style={[styles.cardTall, {marginBottom: 20, paddingBottom: 16}]}>
					<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
						<Text style={styles.cardTitle}>Nashik Kumbh Mela - Live Map</Text>
					</View>
					
					{/* Map Preview Card */}
					<View style={{
						height: 280,
						borderRadius: 12,
						overflow: 'hidden',
						backgroundColor: '#E5E7EB',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 16,
						position: 'relative'
					}}>
						{currentLocation ? (
							<>
								<LinearGradient 
									colors={["#F59E0B", "#D97706"]} 
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										justifyContent: 'center',
										alignItems: 'center',
										padding: 16
									}}
								>
									<Text style={{fontSize: 56, marginBottom: 12}}>🗺️</Text>
									<Text style={[styles.cardTitle, {color: 'white', marginBottom: 6, fontSize: 18}]}>
										Interactive Map
									</Text>
									<Text style={[styles.rowSubtitle, {color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 16, fontSize: 12}]}>
										View all {NASHIK_LOCATIONS.length} locations{'\n'}with real-time crowd data
									</Text>
									<TouchableOpacity 
										onPress={() => openGoogleMapsWithAllLocations(NASHIK_LOCATIONS, currentLocation)}
										style={[styles.primaryBtn, {
											backgroundColor: 'white',
											paddingHorizontal: 24,
											paddingVertical: 12,
											borderRadius: 12,
											shadowColor: '#000',
											shadowOffset: { width: 0, height: 4 },
											shadowOpacity: 0.3,
											shadowRadius: 8,
											elevation: 8,
											minWidth: 200
										}]}
										activeOpacity={0.8}
									>
										<Text style={[styles.primaryBtnText, {color: '#F59E0B', fontSize: 14, fontWeight: 'bold'}]}>
											🗺️ Open in Google Maps
										</Text>
									</TouchableOpacity>
								</LinearGradient>
							</>
						) : (
							<View style={{justifyContent: 'center', alignItems: 'center'}}>
								<ActivityIndicator size="large" color="#F59E0B" />
								<Text style={[styles.rowSubtitle, {marginTop: 8, fontSize: 12}]}>Getting your location...</Text>
							</View>
						)}
					</View>
					
					{/* Quick Stats */}
					{/* <View style={{marginTop: 12, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#F9FAFB', borderRadius: 8}}>
						<View style={{alignItems: 'center', flex: 1}}>
							<Text style={[styles.cardTitle, {fontSize: 20, color: '#F59E0B'}]}>{NASHIK_LOCATIONS.length}</Text>
							<Text style={[styles.rowSubtitle, {fontSize: 10}]}>Locations</Text>
						</View>
						<View style={{alignItems: 'center', flex: 1}}>
							<Text style={[styles.cardTitle, {fontSize: 20, color: '#10B981'}]}>
								{NASHIK_LOCATIONS.filter(l => l.type === LOCATION_TYPES.MEDICAL).length}
							</Text>
							<Text style={[styles.rowSubtitle, {fontSize: 10}]}>Medical</Text>
						</View>
						<View style={{alignItems: 'center', flex: 1}}>
							<Text style={[styles.cardTitle, {fontSize: 20, color: '#8B5CF6'}]}>
								{NASHIK_LOCATIONS.filter(l => l.type === LOCATION_TYPES.CAMP).length}
							</Text>
							<Text style={[styles.rowSubtitle, {fontSize: 10}]}>Camps</Text>
						</View>
						<View style={{alignItems: 'center', flex: 1}}>
							<Text style={[styles.cardTitle, {fontSize: 20, color: '#F59E0B'}]}>
								{NASHIK_LOCATIONS.filter(l => l.type === LOCATION_TYPES.GHAT).length}
							</Text>
							<Text style={[styles.rowSubtitle, {fontSize: 10}]}>Ghats</Text>
						</View>
					</View> */}
					
					{/* <View style={{marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 4}}>
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Your Location</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Medical</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B5CF6', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Camps</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#F59E0B', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Ghats</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Facilities</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
							<View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginRight: 4}} />
							<Text style={[styles.rowSubtitle, {fontSize: 9}]}>Temples</Text>
						</View>
					</View> */}
					{/* <Text style={[styles.rowSubtitle, {marginTop: 8, marginBottom: 8, fontSize: 9, textAlign: 'center', color: '#6B7280', paddingHorizontal: 8}]}>
						Tap "Open in Google Maps" to view interactive map with all locations and navigation
					</Text> */}
				</View>
			)}

			{/* Route Suggestions Modal */}
			<Modal
				visible={showRoutes}
				transparent
				animationType="slide"
				onRequestClose={() => setShowRoutes(false)}
			>
				<View style={{
					flex: 1,
					backgroundColor: 'rgba(0,0,0,0.5)',
					justifyContent: 'flex-end'
				}}>
					<View style={{
						backgroundColor: 'white',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						padding: 20,
						maxHeight: '80%'
					}}>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
							<Text style={[styles.cardTitle, {flex: 1}]}>
								Route to {selectedDestination?.name}
							</Text>
							<TouchableOpacity onPress={() => setShowRoutes(false)}>
								<Text style={[styles.textOrange, {fontSize: 18}]}>✕</Text>
							</TouchableOpacity>
						</View>
						
						<ScrollView>
							{routeSuggestions.map((route, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => {
										setShowRoutes(false);
										openGoogleMaps(selectedDestination, route.waypoints);
									}}
									style={{
										padding: 16,
										backgroundColor: index === 0 ? '#F0FDF4' : '#F9FAFB',
										borderRadius: 12,
										marginBottom: 12,
										borderWidth: index === 0 ? 2 : 1,
										borderColor: index === 0 ? '#10B981' : '#E5E7EB'
									}}
								>
									<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
										<View style={{flex: 1}}>
											<Text style={[styles.rowTitle, {marginBottom: 4}]}>
												{index === 0 ? '⭐ ' : ''}{route.name}
											</Text>
											<Text style={styles.rowSubtitle}>
												Distance: {route.distance} • Time: {route.time}
											</Text>
											<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
												<View style={{
													backgroundColor: getCrowdColor(route.totalCrowd),
													paddingHorizontal: 8,
													paddingVertical: 4,
													borderRadius: 4
												}}>
													<Text style={{color: 'white', fontSize: 10, fontWeight: '600'}}>
														Crowd: {route.crowdLevel}
													</Text>
												</View>
												{route.waypoints.length > 0 && (
													<Text style={[styles.rowSubtitle, {marginLeft: 8, fontSize: 10}]}>
														Via: {route.waypoints.map(w => w.name).join(', ')}
													</Text>
												)}
											</View>
										</View>
										<Text style={[styles.textOrange, {fontSize: 20}]}>➡️</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
						
						<Text style={[styles.rowSubtitle, {marginTop: 12, fontSize: 11, textAlign: 'center', color: '#6B7280'}]}>
							⭐ Recommended route (least crowded)
						</Text>
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
};
