import { Trip } from '../types/trip';

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: 'sample-kyoto-7d',
    title: '7 Days of Zen & Culture in Kyoto',
    destination: 'Kyoto',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    summary: 'A curated immersion into ancient Shinto shrines, tranquil zen rock gardens, traditional matcha tea ceremonies, and exquisite Kaiseki dining in historic Gion.',
    startDate: '2026-11-10',
    endDate: '2026-11-16',
    durationDays: 7,
    preferences: {
      destination: 'Kyoto, Japan',
      departureCity: 'New Delhi (DEL)',
      startDate: '2026-11-10',
      endDate: '2026-11-16',
      durationDays: 7,
      travelerType: 'couple',
      adultsCount: 2,
      childrenCount: 0,
      budgetStyle: 'comfortable',
      totalBudget: 260000,
      currency: 'INR',
      interests: ['Culture & History', 'Food & Local Cuisine', 'Photography', 'Art & Architecture'],
      pace: 'balanced',
      dietaryNeeds: 'No restrictions',
      accommodationType: 'Traditional Machiya Ryokan',
      transportPreference: 'Kyoto Bus & Subways + Walking',
      specialInstructions: 'Focus on early morning temple visits before crowds arrive.'
    },
    budget: {
      flights: 95000,
      accommodation: 85000,
      food: 42000,
      transportation: 12000,
      activities: 16000,
      shopping: 6000,
      emergencyBuffer: 4000,
      totalPlanned: 260000,
      currency: 'INR'
    },
    actualExpenses: [
      { id: 'exp-1', title: 'Roundtrip Flights (DEL - KIX via Tokyo)', amount: 92000, category: 'flights', date: '2026-11-10' },
      { id: 'exp-2', title: 'Ryokan Gion Stay Advance Deposit', amount: 42000, category: 'accommodation', date: '2026-11-10' },
      { id: 'exp-3', title: 'ICOCA Transit Cards + Kansai Express Pass', amount: 6500, category: 'transportation', date: '2026-11-11' }
    ],
    practicalTips: [
      'Purchase an IC card (ICOCA/Suica) for seamless tap-and-go travel on local buses and subways.',
      'Visit Fushimi Inari and Arashiyama before 07:30 AM for photography without tour bus congestion.',
      'Always carry Japanese yen cash as traditional tea houses and shrine counters do not accept foreign credit cards.',
      'Wear slip-on shoes; you will frequently take off shoes before entering temple tatami halls.'
    ],
    weatherAlternatives: [
      'If it rains, spend the afternoon browsing the undercover craft arcades of Nishiki Market or the Kyoto Railway Museum.',
      'Rain adds a poetic mist to the moss garden of Gio-ji temple in Arashiyama.'
    ],
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-28T09:30:00Z',
    days: [
      {
        dayNumber: 1,
        date: '2026-11-10',
        title: 'Arrival in Kyoto & Gion Evening Stroll',
        theme: 'Historic Arrival',
        dailyEstimatedCost: 8300,
        weatherRecommendation: 'Crisp autumn weather (17°C). Light wool jacket recommended.',
        activities: [
          {
            id: 'act-1',
            name: 'Check-in to Machiya Ryokan in Gion',
            time: '02:00 PM',
            period: 'afternoon',
            category: 'Relaxation',
            description: 'Settle into your traditional wooden machiya townhouse featuring tatami flooring and a private tsuboniwa courtyard garden.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Gion Historic Quarter, Kyoto', lat: 35.0037, lng: 135.7772 },
            insiderTip: 'Complimentary roasted hojicha tea and seasonal wagashi are served upon check-in.',
            isCompleted: true
          },
          {
            id: 'act-2',
            name: 'Twilight Walk along Shirakawa Canal',
            time: '04:30 PM',
            period: 'afternoon',
            category: 'Sightseeing',
            description: 'Stroll alongside willow trees and stone-paved alleys lined with traditional ochaya teahouses as lanterns are lit.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Shirakawa Minami-dori', lat: 35.0055, lng: 135.7735 },
            insiderTip: 'Keep your camera ready for glimpses of Geiko and Maiko heading to evening banquet appointments.',
            isCompleted: true
          },
          {
            id: 'act-3',
            name: 'Welcome Kaiseki Tasting Dinner',
            time: '07:00 PM',
            period: 'evening',
            category: 'Food',
            description: 'Multi-course seasonal Kyoto banquet featuring yuba (tofu skin), seasonal sashimi, grilled duck breast, and matsutake broth.',
            duration: '2.0 hrs',
            estimatedCost: 6500,
            location: { name: 'Pontocho Alley Dining Terrace', lat: 35.0061, lng: 135.7712 },
            insiderTip: 'Book in advance for a tatami room overlooking the Kamogawa river.',
            bookingRequired: true,
            isCompleted: false
          },
          {
            id: 'act-4',
            name: 'Nightcap Matcha Spritz & Jazz',
            time: '09:30 PM',
            period: 'evening',
            category: 'Nightlife',
            description: 'Intimate vinyl cocktail salon serving craft cocktails infused with Uji matcha and Japanese botanical gin.',
            duration: '1.5 hrs',
            estimatedCost: 1800,
            location: { name: 'Pontocho Alley Vinyl Bar', lat: 35.005, lng: 135.7705 },
            isCompleted: false
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-11-11',
        title: 'Spiritual Sunrise & Golden Pavilions',
        theme: 'Zen Architecture',
        dailyEstimatedCost: 4950,
        weatherRecommendation: 'Sunny with cool morning breezes (14°C). Walking shoes essential.',
        activities: [
          {
            id: 'act-5',
            name: 'Sunrise Walk at Fushimi Inari-taisha',
            time: '06:45 AM',
            period: 'morning',
            category: 'Culture',
            description: 'Ascend Mount Inari beneath thousands of vermilion torii gates winding through ancient cedar forests before the crowds arrive.',
            duration: '2.5 hrs',
            estimatedCost: 0,
            location: { name: 'Fushimi Inari-taisha', lat: 34.9671, lng: 135.7727 },
            insiderTip: 'Continue past the Yotsutsuji intersection for panoramic views of Kyoto valley in early morning mist.',
            isCompleted: false
          },
          {
            id: 'act-6',
            name: 'Traditional Inari Kitsune Udon Breakfast',
            time: '09:30 AM',
            period: 'morning',
            category: 'Food',
            description: 'Steaming dashi noodles topped with sweet simmered aburaage tofu, prepared fresh since 1540.',
            duration: '1.0 hr',
            estimatedCost: 900,
            location: { name: 'Nezameya Historic Teahouse', lat: 34.968, lng: 135.771 },
            insiderTip: 'Try their specialty grilled unagi (eel) glazed with centuries-old tare sauce.',
            isCompleted: false
          },
          {
            id: 'act-7',
            name: 'Kinkaku-ji (The Golden Pavilion)',
            time: '11:30 AM',
            period: 'afternoon',
            category: 'Architecture',
            description: 'Witness the top two floors of the Zen temple entirely covered in brilliant gold leaf, shimmering over Mirror Pond.',
            duration: '1.5 hrs',
            estimatedCost: 550,
            location: { name: 'Kinkakuji-cho, Kita Ward', lat: 35.0394, lng: 135.7292 },
            insiderTip: 'Admission ticket is an auspicious protective talisman calligraphy slip.',
            isCompleted: false
          },
          {
            id: 'act-8',
            name: 'Ryoan-ji Zen Dry Rock Garden Meditation',
            time: '02:00 PM',
            period: 'afternoon',
            category: 'Culture',
            description: 'Contemplate Japan’s most famous karesansui rock garden: fifteen mysterious stones positioned on raked white gravel.',
            duration: '1.5 hrs',
            estimatedCost: 600,
            location: { name: 'Ryoanji Goryonoshitacho', lat: 35.0345, lng: 135.7182 },
            insiderTip: 'From any vantage point on the veranda, at least one stone remains hidden from view.',
            isCompleted: false
          },
          {
            id: 'act-9',
            name: 'Soba Noodle Dinner with Duck & Mountain Herbs',
            time: '06:30 PM',
            period: 'evening',
            category: 'Food',
            description: 'Hand-cut 100% buckwheat Juwari soba served cold on bamboo mats with duck dipping broth.',
            duration: '1.5 hrs',
            estimatedCost: 2900,
            location: { name: 'Arashiyama Honke Soba', lat: 35.015, lng: 135.678 },
            isCompleted: false
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-11-12',
        title: 'Bamboo Whispers & River Canyons in Arashiyama',
        theme: 'Nature & Bamboo',
        dailyEstimatedCost: 4600,
        weatherRecommendation: 'Partly cloudy (18°C). Ideal for walking through forest paths.',
        activities: [
          {
            id: 'act-10',
            name: 'Early Morning Bamboo Grove Walk',
            time: '07:30 AM',
            period: 'morning',
            category: 'Nature',
            description: 'Immerse in the towering green bamboo stalks gently swaying in the morning wind, creating Japan’s most famous soundscape.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Arashiyama Bamboo Grove', lat: 35.017, lng: 135.6713 },
            insiderTip: 'Visit before 08:30 AM to hear the natural rustle of the bamboo stalks in the morning wind.',
            isCompleted: false
          },
          {
            id: 'act-11',
            name: 'Tenryu-ji Temple & Sogenchi Garden',
            time: '09:30 AM',
            period: 'morning',
            category: 'Culture',
            description: 'World Heritage 14th-century landscape garden that flawlessly borrows the scenery of the Arashiyama mountains.',
            duration: '1.5 hrs',
            estimatedCost: 600,
            location: { name: 'Saga-Tenryuji, Ukyo Ward', lat: 35.0158, lng: 135.6775 },
            insiderTip: 'Notice the Cloud Dragon painting on the Hatto ceiling whose eyes follow you as you walk.',
            isCompleted: false
          },
          {
            id: 'act-12',
            name: 'Hozugawa River Traditional Boat Cruise',
            time: '01:30 PM',
            period: 'afternoon',
            category: 'Adventure',
            description: 'A 2-hour whitewater flatboat ride guided by local boatmen through scenic wooded river gorges and cedar hills.',
            duration: '2.0 hrs',
            estimatedCost: 2800,
            location: { name: 'Hozugawa River Dock', lat: 35.018, lng: 135.672 },
            bookingRequired: true,
            isCompleted: false
          },
          {
            id: 'act-13',
            name: 'Matcha Soft-Serve & Street Wagashi',
            time: '04:30 PM',
            period: 'afternoon',
            category: 'Food',
            description: 'Uji matcha rich soft-cream dusted with roasted kinako soybean powder and fresh warabimochi.',
            duration: '0.5 hr',
            estimatedCost: 450,
            location: { name: 'Togetsukyo Bridge Promenade', lat: 35.0128, lng: 135.6778 },
            isCompleted: false
          },
          {
            id: 'act-14',
            name: 'Charcoal Yakitori Dinner in Central Kyoto',
            time: '07:30 PM',
            period: 'evening',
            category: 'Food',
            description: 'Skewers of local Tamba chicken grilled over Kishu binchotan white charcoal with tare dipping sauce.',
            duration: '1.5 hrs',
            estimatedCost: 750,
            location: { name: 'Kawaramachi Yakitori Den', lat: 35.004, lng: 135.769 },
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'sample-amalfi-5d',
    title: '5 Days Cliffside Romance on the Amalfi Coast',
    destination: 'Amalfi Coast',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summary: 'Pastel cliff villages, fragrant lemon grove lunches in Ravello, private sunset aperitivos in Positano, and scenic hydrofoil ferry cruising along the sapphire Mediterranean Sea.',
    startDate: '2026-06-12',
    endDate: '2026-06-16',
    durationDays: 5,
    preferences: {
      destination: 'Amalfi Coast, Italy',
      departureCity: 'Mumbai (BOM)',
      startDate: '2026-06-12',
      endDate: '2026-06-16',
      durationDays: 5,
      travelerType: 'couple',
      adultsCount: 2,
      childrenCount: 0,
      budgetStyle: 'luxury',
      totalBudget: 340000,
      currency: 'INR',
      interests: ['Food & Local Cuisine', 'Beaches & Coastal', 'Photography', 'Art & Architecture'],
      pace: 'relaxed',
      dietaryNeeds: 'No restrictions',
      accommodationType: 'Cliffside Boutique Hotel',
      transportPreference: 'Ferry & Private Boat',
      specialInstructions: 'Celebrate 5th anniversary with scenic terrace views.'
    },
    budget: {
      flights: 120000,
      accommodation: 135000,
      food: 50000,
      transportation: 15000,
      activities: 12000,
      shopping: 5000,
      emergencyBuffer: 3000,
      totalPlanned: 340000,
      currency: 'INR'
    },
    actualExpenses: [
      { id: 'exp-am-1', title: 'Roundtrip Flights (BOM - FCO via Doha)', amount: 118000, category: 'flights', date: '2026-06-12' },
      { id: 'exp-am-2', title: 'Positano Cliffside Suite Deposit', amount: 65000, category: 'accommodation', date: '2026-06-12' },
      { id: 'exp-am-3', title: 'Hydrofoil Ferry Pass (Salerno - Positano)', amount: 4800, category: 'transportation', date: '2026-06-13' }
    ],
    practicalTips: [
      'Travel by hydrofoil ferry rather than buses along the winding cliff roads to avoid motion sickness and traffic delays.',
      'Book dinners at least 3 weeks in advance for terrace tables in Positano and Ravello.'
    ],
    weatherAlternatives: [
      'If sea conditions are choppy, spend the day exploring Villa Cimbrone gardens and ceramic workshops in Vietri sul Mare.'
    ],
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-28T09:00:00Z',
    days: [
      {
        dayNumber: 1,
        date: '2026-06-12',
        title: 'Positano Arrival & Sunset Spritz',
        theme: 'Coastal Romance',
        dailyEstimatedCost: 14200,
        weatherRecommendation: 'Warm Mediterranean sun (26°C). Sunglasses & linen clothing recommended.',
        activities: [
          {
            id: 'act-am-1',
            name: 'Check-in & Terrace Welcome Drink',
            time: '02:30 PM',
            period: 'afternoon',
            category: 'Relaxation',
            description: 'Check into your sea-facing balcony suite overlooking the cascading pastel houses of Positano.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Positano Central Cliffs', lat: 40.6281, lng: 14.4850 },
            insiderTip: 'Complimentary limoncello is served at the pool bar.',
            isCompleted: true
          },
          {
            id: 'act-am-2',
            name: 'Sunset Aperitivo at Franco’s Bar',
            time: '06:30 PM',
            period: 'evening',
            category: 'Nightlife',
            description: 'Sip Campari spritz alongside panoramic vistas of the pastel town cascading into the deep blue sea.',
            duration: '2.0 hrs',
            estimatedCost: 4500,
            location: { name: 'Via Cristoforo Colombo, Positano', lat: 40.6295, lng: 14.4862 },
            insiderTip: 'Arrive 30 minutes before sunset opening as they do not take reservations.',
            isCompleted: false
          },
          {
            id: 'act-am-3',
            name: 'Seafood Scialatielli Dinner by the Beach',
            time: '08:30 PM',
            period: 'evening',
            category: 'Food',
            description: 'Fresh catch of clams, mussels, and calamari tossed with hand-rolled Campanian ribbon pasta.',
            duration: '2.0 hrs',
            estimatedCost: 9700,
            location: { name: 'Spiaggia Grande, Positano', lat: 40.6278, lng: 14.4845 },
            insiderTip: 'Ask for lemon sorbet served directly inside a fresh chilled Amalfi lemon.',
            bookingRequired: true,
            isCompleted: false
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-06-13',
        title: 'Ravello Heights & Villa Rufolo Gardens',
        theme: 'Classical Art & Serenity',
        dailyEstimatedCost: 8200,
        weatherRecommendation: 'Pleasant mountain breezes (24°C). Walking shoes recommended for cobblestones.',
        activities: [
          {
            id: 'act-am-4',
            name: 'Scenic Drive to Mount Lattari & Ravello',
            time: '09:30 AM',
            period: 'morning',
            category: 'Sightseeing',
            description: 'Ascend 365 meters above the sea into the historic peaceful sanctuary of Ravello.',
            duration: '1.0 hr',
            estimatedCost: 2200,
            location: { name: 'Ravello Town Square', lat: 40.6492, lng: 14.6117 },
            isCompleted: false
          },
          {
            id: 'act-am-5',
            name: 'Villa Rufolo Gardens & Infinity Terrace',
            time: '11:00 AM',
            period: 'morning',
            category: 'Nature',
            description: 'Wander through exotic pines and flowerbeds framing the iconic twin-domed chapel and endless sea.',
            duration: '2.0 hrs',
            estimatedCost: 1100,
            location: { name: 'Piazza Vescovado, Ravello', lat: 40.6488, lng: 14.6120 },
            insiderTip: 'Wagner composed parts of Parsifal here in 1880.',
            isCompleted: false
          },
          {
            id: 'act-am-6',
            name: 'Farm-to-Table Lunch in Lemon Grove',
            time: '01:30 PM',
            period: 'afternoon',
            category: 'Food',
            description: 'Dine under a shaded canopy of fragrant sfusato amalfitano lemons, enjoying homemade ricotta and gnocchi.',
            duration: '2.0 hrs',
            estimatedCost: 4900,
            location: { name: 'Lemon Garden Trattoria, Ravello', lat: 40.6475, lng: 14.6105 },
            bookingRequired: true,
            isCompleted: false
          }
        ]
      }
    ]
  }
];
