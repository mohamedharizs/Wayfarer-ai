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
      departureCity: 'San Francisco (SFO)',
      startDate: '2026-11-10',
      endDate: '2026-11-16',
      durationDays: 7,
      travelerType: 'couple',
      adultsCount: 2,
      childrenCount: 0,
      budgetStyle: 'comfortable',
      totalBudget: 3200,
      currency: 'USD',
      interests: ['Culture & History', 'Food & Local Cuisine', 'Photography', 'Architecture'],
      pace: 'balanced',
      dietaryNeeds: 'No restrictions',
      accommodationType: 'Traditional Machiya Ryokan',
      transportPreference: 'Kyoto Bus & Subways + Walking',
      specialInstructions: 'Focus on early morning temple visits before crowds arrive.'
    },
    budget: {
      flights: 1100,
      accommodation: 980,
      food: 560,
      transportation: 120,
      activities: 260,
      shopping: 100,
      emergencyBuffer: 80,
      totalPlanned: 3200,
      currency: 'USD'
    },
    actualExpenses: [
      { id: 'exp-1', title: 'Roundtrip Flights (SFO - KIX)', amount: 1050, category: 'flights', date: '2026-11-10' },
      { id: 'exp-2', title: 'Ryokan Gion Stay Deposit', amount: 490, category: 'accommodation', date: '2026-11-10' },
      { id: 'exp-3', title: 'Kyoto Subway 7-Day Pass', amount: 45, category: 'transportation', date: '2026-11-11' }
    ],
    practicalTips: [
      'Purchase an IC card (ICOCA/Suica) for seamless tap-and-go travel on local buses and subways.',
      'Visit Fushimi Inari and Arashiyama before 8:00 AM for photography without tour bus congestion.',
      'Always carry small yen cash banknotes as traditional tea houses and shrine counters do not accept credit cards.',
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
        title: 'Arrival & Evening Lanterns of Gion',
        theme: 'Historical Heritage',
        dailyEstimatedCost: 115,
        weatherRecommendation: 'Crisp autumn evening (16°C). Light jacket recommended.',
        activities: [
          {
            id: 'act-1-1',
            name: 'Check-in at Machiya Inn & Orientation',
            time: '03:00 PM',
            period: 'afternoon',
            category: 'Relaxation',
            description: 'Settle into your renovated traditional wooden townhouse near the Shirakawa canal. Unpack and enjoy a welcoming cup of Uji green tea.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Shirakawa Canal, Gion', lat: 35.0037, lng: 135.7762 },
            insiderTip: 'Ask the concierge for a hand-drawn neighborhood map with hidden bakeries.',
            isCompleted: true
          },
          {
            id: 'act-1-2',
            name: 'Lantern Walk through Hanamikoji Dori',
            time: '05:30 PM',
            period: 'evening',
            category: 'Culture',
            description: 'Stroll the atmospheric cobblestone alleyways lined with ochaya (teahouses) and wooden lattices illuminated by soft paper lanterns.',
            duration: '2.0 hrs',
            estimatedCost: 0,
            location: { name: 'Hanamikoji Street, Kyoto', lat: 35.0022, lng: 135.7750 },
            insiderTip: 'Keep your camera respectful and give right of way to walking Geiko and Maiko.',
            isCompleted: true
          },
          {
            id: 'act-1-3',
            name: 'Seasonal Kyo-Kaiseki Tasting Dinner',
            time: '07:30 PM',
            period: 'evening',
            category: 'Food',
            description: 'A multi-course culinary journey celebrating seasonal ingredients, delicate dashi, and Kyoto yuba (tofu skin) delicacies.',
            duration: '2.5 hrs',
            estimatedCost: 115,
            location: { name: 'Gion Nanba, Higashiyama', lat: 35.0041, lng: 135.7745 },
            insiderTip: 'Reservations should be reconfirmed at check-in.',
            bookingRequired: true,
            isCompleted: false
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-11-11',
        title: 'Torii Gates & Sacred Mountain Trails',
        theme: 'Spiritual Exploration',
        dailyEstimatedCost: 65,
        weatherRecommendation: 'Sunny morning (14°C) warming to 19°C. Great for hiking.',
        activities: [
          {
            id: 'act-2-1',
            name: 'Fushimi Inari-taisha Thousand Torii Hike',
            time: '07:00 AM',
            period: 'morning',
            category: 'Sightseeing',
            description: 'Hike through the iconic tunnel of vibrant vermilion gates winding up the sacred Mount Inari forest to the Yotsutsuji viewpoint.',
            duration: '3.0 hrs',
            estimatedCost: 0,
            location: { name: 'Fushimi Inari Taisha', lat: 34.9671, lng: 135.7727 },
            insiderTip: 'Past the halfway point at Yotsutsuji, 80% of tourists turn back, leaving peaceful mountain paths.',
            isCompleted: false
          },
          {
            id: 'act-2-2',
            name: 'Inari Kitsune Udon & Tofu Lunch',
            time: '12:00 PM',
            period: 'afternoon',
            category: 'Food',
            description: 'Taste sweet simmered aburaage tofu pocket over hot springy udon noodles in a century-old hillside eatery.',
            duration: '1.0 hr',
            estimatedCost: 20,
            location: { name: 'Kitsune Udon Stall, Inari Path', lat: 34.9680, lng: 135.7715 },
            insiderTip: 'Pair with roasted barley tea (mugicha).',
            isCompleted: false
          },
          {
            id: 'act-2-3',
            name: 'Tofuku-ji Temple Zen Rock & Moss Garden',
            time: '02:00 PM',
            period: 'afternoon',
            category: 'Culture',
            description: 'Admire the famous checkerboard moss garden designed by Mirei Shigemori and the Tsutenkyo Bridge framed by Japanese maples.',
            duration: '2.0 hrs',
            estimatedCost: 15,
            location: { name: 'Tofukuji Temple', lat: 34.9810, lng: 135.7740 },
            insiderTip: 'Sit on the wooden veranda for 15 minutes of quiet contemplation.',
            isCompleted: false
          },
          {
            id: 'act-2-4',
            name: 'Craft Beer & Yakitori in Pontocho Alley',
            time: '06:30 PM',
            period: 'evening',
            category: 'Nightlife',
            description: 'Wander the narrow dining alley beside the Kamogawa River, savoring charcoal-grilled skewers and local Kyoto IPAs.',
            duration: '2.5 hrs',
            estimatedCost: 30,
            location: { name: 'Pontocho Alley, Nakagyo', lat: 35.0065, lng: 135.7712 },
            insiderTip: 'Look for bars with a red lantern hanging outside for welcoming counter seats.',
            isCompleted: false
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-11-12',
        title: 'Bamboo Grove & Zen Aesthetics of Arashiyama',
        theme: 'Nature & Tranquility',
        dailyEstimatedCost: 85,
        weatherRecommendation: 'Partly cloudy, misty morning. Ideal for bamboo groves.',
        activities: [
          {
            id: 'act-3-1',
            name: 'Sagano Bamboo Forest Dawn Walk',
            time: '07:30 AM',
            period: 'morning',
            category: 'Nature',
            description: 'Listen to the rustling wind whispering through soaring green bamboo stalks in the early morning stillness.',
            duration: '1.5 hrs',
            estimatedCost: 0,
            location: { name: 'Arashiyama Bamboo Grove', lat: 35.0170, lng: 135.6713 },
            insiderTip: 'Exit through the north path directly toward the quiet Okochi Sanso Villa garden.',
            isCompleted: false
          },
          {
            id: 'act-3-2',
            name: 'Tenryu-ji Temple Sogenchi Pond Meditation',
            time: '09:30 AM',
            period: 'morning',
            category: 'Culture',
            description: 'Gaze upon the 14th-century landscaped garden designed by Muso Soseki, reflecting the surrounding Arashiyama mountain ridge.',
            duration: '1.5 hrs',
            estimatedCost: 10,
            location: { name: 'Tenryuji Temple', lat: 35.0158, lng: 135.6775 },
            insiderTip: 'The dragon painting on the ceiling of Hatto hall appears to gaze at you from every angle.',
            isCompleted: false
          },
          {
            id: 'act-3-3',
            name: 'Yudofu (Simmered Tofu) Lunch by the Oi River',
            time: '12:30 PM',
            period: 'afternoon',
            category: 'Food',
            description: 'Silken hot tofu simmered in kombu broth, dipped in ginger soy, served in a serene courtyard garden setting.',
            duration: '1.5 hrs',
            estimatedCost: 40,
            location: { name: 'Shoraian, Arashiyama', lat: 35.0135, lng: 135.6698 },
            bookingRequired: true,
            isCompleted: false
          },
          {
            id: 'act-3-4',
            name: 'Kiyomizu-dera Sunset Overlook',
            time: '04:30 PM',
            period: 'afternoon',
            category: 'Architecture',
            description: 'Stand on the vast wooden stage constructed without a single nail, overlooking Kyoto city as the golden hour turns indigo.',
            duration: '2.0 hrs',
            estimatedCost: 10,
            location: { name: 'Kiyomizu-dera Temple', lat: 34.9949, lng: 135.7850 },
            insiderTip: 'Drink from the Otowa Waterfall three streams for health, longevity, or success.',
            isCompleted: false
          },
          {
            id: 'act-3-5',
            name: 'Matcha Parfait & Gion Night Walk',
            time: '07:30 PM',
            period: 'evening',
            category: 'Food',
            description: 'Indulge in a towering artisan green tea parfait layered with mochi, red bean, and matcha chiffon at Tsujiri.',
            duration: '1.0 hr',
            estimatedCost: 25,
            location: { name: 'Saryo Tsujiri Gion', lat: 35.0035, lng: 135.7758 },
            isCompleted: false
          }
        ]
      }
    ]
  }
];
