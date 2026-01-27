import type { HazardReport, CoastalHazardReport, SocialMediaPost, GeoFence } from "../types"

export const mockHazardReports: HazardReport[] = [
  {
    id: "1",
    title: "Cyclone Alert - Bay of Bengal",
    description: "Severe cyclonic storm approaching eastern coast",
    type: "cyclone",
    severity: "high",
    status: "verified",
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: "Chennai, Tamil Nadu",
    },
    source: "official",
    timestamp: "2024-01-15T10:30:00Z",
    reporter: {
      name: "India Meteorological Department",
      credibility: 0.98,
      location: "Chennai",
    },
    media: [
      {
        id: "m1",
        type: "image",
        url: "/satellite-image-of-cyclone-over-bay-of-bengal.jpg",
        thumbnail: "/satellite-image-of-cyclone-over-bay-of-bengal.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Tsunami Warning - Indian Ocean",
    description: "Underwater earthquake detected, tsunami alert issued",
    type: "tsunami",
    severity: "critical",
    status: "escalated",
    location: {
      latitude: 6.9271,
      longitude: 79.8612,
      address: "Colombo, Sri Lanka",
    },
    source: "sensor",
    timestamp: "2024-01-15T09:15:00Z",
    reporter: {
      name: "Pacific Tsunami Warning Center",
      credibility: 0.99,
      location: "Honolulu",
    },
  },
  {
    id: "3",
    title: "Oil Spill - Mumbai Coast",
    description: "Large oil spill reported near shipping lanes",
    type: "oil_spill",
    severity: "high",
    status: "triaged",
    location: {
      latitude: 18.922,
      longitude: 72.8347,
      address: "Mumbai Harbor, Maharashtra",
    },
    source: "citizen",
    timestamp: "2024-01-15T08:45:00Z",
    reporter: {
      name: "Local Fisherman",
      credibility: 0.65,
      location: "Mumbai",
    },
    media: [
      {
        id: "m2",
        type: "image",
        url: "/oil-spill-on-ocean-surface-near-ships.jpg",
        thumbnail: "/oil-spill-on-ocean-surface-near-ships.jpg",
      },
    ],
  },
]

export const mockCoastalReports: CoastalHazardReport[] = [
  {
    id: "c1",
    title: "Tsunami Warning - Bay of Bengal",
    description: "Seismic activity detected, potential tsunami threat to eastern coast",
    type: "tsunami",
    severity: "critical",
    status: "escalated",
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: "Chennai Coast, Tamil Nadu",
      coastalZone: "Bay of Bengal",
    },
    source: "sensor",
    socialMediaData: {
      platform: "Twitter",
      sentiment: -0.8,
      credibilityScore: 0.95,
      viralityIndex: 0.9,
      geoTagged: true,
    },
    geoFencing: {
      radius: 50000, // 50km for tsunami
      networkNodes: 1250,
      validationScore: 0.92,
      fakeNewsRisk: "low",
    },
    crowdScore: 0.94,
    timestamp: "2024-01-15T10:30:00Z",
    reporter: {
      name: "Coastal Monitoring Station",
      credibility: 0.98,
      location: "Chennai",
    },
  },
  {
    id: "c2",
    title: "Cyclone Approaching - Arabian Sea",
    description: "Category 3 cyclone moving towards Gujarat coast",
    type: "cyclone",
    severity: "high",
    status: "verified",
    location: {
      latitude: 22.2587,
      longitude: 71.1924,
      address: "Porbandar Coast, Gujarat",
      coastalZone: "Arabian Sea",
    },
    source: "satellite",
    socialMediaData: {
      platform: "Instagram",
      sentiment: -0.6,
      credibilityScore: 0.88,
      viralityIndex: 0.7,
      geoTagged: true,
    },
    geoFencing: {
      radius: 75000, // 75km for cyclone
      networkNodes: 2100,
      validationScore: 0.89,
      fakeNewsRisk: "low",
    },
    crowdScore: 0.87,
    timestamp: "2024-01-15T09:15:00Z",
    reporter: {
      name: "Weather Station Gujarat",
      credibility: 0.96,
      location: "Porbandar",
    },
  },
  {
    id: "c3",
    title: "Oil Spill Detected - Mumbai Harbor",
    description: "Large oil spill reported near shipping lanes",
    type: "oil_spill",
    severity: "high",
    status: "triaged",
    location: {
      latitude: 18.922,
      longitude: 72.8347,
      address: "Mumbai Harbor, Maharashtra",
      coastalZone: "Arabian Sea",
    },
    source: "citizen",
    socialMediaData: {
      platform: "Facebook",
      sentiment: -0.7,
      credibilityScore: 0.75,
      viralityIndex: 0.6,
      geoTagged: true,
    },
    geoFencing: {
      radius: 15000, // 15km for oil spill
      networkNodes: 890,
      validationScore: 0.78,
      fakeNewsRisk: "medium",
    },
    crowdScore: 0.72,
    timestamp: "2024-01-15T08:45:00Z",
    reporter: {
      name: "Local Fisherman",
      credibility: 0.65,
      location: "Mumbai",
    },
  },
  {
    id: "c4",
    title: "Storm Surge Alert - Kochi",
    description: "High tide and storm surge warning for Kerala coast",
    type: "storm_surge",
    severity: "medium",
    status: "verified",
    location: {
      latitude: 9.9312,
      longitude: 76.2673,
      address: "Kochi, Kerala",
      coastalZone: "Arabian Sea",
    },
    source: "official",
    socialMediaData: {
      platform: "Twitter",
      sentiment: -0.4,
      credibilityScore: 0.92,
      viralityIndex: 0.5,
      geoTagged: true,
    },
    geoFencing: {
      radius: 25000, // 25km for storm surge
      networkNodes: 650,
      validationScore: 0.91,
      fakeNewsRisk: "low",
    },
    crowdScore: 0.89,
    timestamp: "2024-01-15T07:20:00Z",
    reporter: {
      name: "Kerala State Disaster Management",
      credibility: 0.94,
      location: "Kochi",
    },
  },
]

export const mockSocialMediaPosts: SocialMediaPost[] = [
  {
    id: "sm1",
    platform: "twitter",
    content: "Massive waves hitting Chennai marina! This looks like tsunami warning is real #TsunamiAlert #Chennai",
    author: {
      username: "@chennai_local",
      verified: false,
      followers: 1250,
    },
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: "Chennai, Tamil Nadu",
    },
    timestamp: "2024-01-15T10:35:00Z",
    engagement: {
      likes: 89,
      shares: 156,
      comments: 23,
    },
    sentiment: -0.8,
    credibilityScore: 0.72,
    geoTagged: true,
    hazardRelated: true,
    aiValidated: true,
  },
  {
    id: "sm2",
    platform: "instagram",
    content: "Dark clouds approaching Gujarat coast. Cyclone Biparjoy getting closer! Stay safe everyone 🌪️",
    author: {
      username: "@gujarat_weather",
      verified: true,
      followers: 45000,
    },
    location: {
      latitude: 22.2587,
      longitude: 71.1924,
      address: "Porbandar, Gujarat",
    },
    timestamp: "2024-01-15T09:20:00Z",
    engagement: {
      likes: 234,
      shares: 89,
      comments: 67,
    },
    sentiment: -0.6,
    credibilityScore: 0.88,
    geoTagged: true,
    hazardRelated: true,
    aiValidated: true,
  },
]

export const mockGeoFences: GeoFence[] = [
  {
    id: "gf1",
    center: {
      latitude: 13.0827,
      longitude: 80.2707,
    },
    radius: 50000,
    type: "coastal",
    networkNodes: ["node1", "node2", "node3"],
    validationRules: {
      minCredibility: 0.7,
      maxFakeNewsRisk: 0.3,
      requiredSources: 2,
    },
    active: true,
  },
  {
    id: "gf2",
    center: {
      latitude: 18.922,
      longitude: 72.8347,
    },
    radius: 25000,
    type: "port",
    networkNodes: ["node4", "node5"],
    validationRules: {
      minCredibility: 0.6,
      maxFakeNewsRisk: 0.4,
      requiredSources: 1,
    },
    active: true,
  },
]
