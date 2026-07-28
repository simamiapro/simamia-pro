export type Locale = 'sw' | 'en'

export const dictionaries = {
  sw: {
    // Navigation
    nav: {
      dashboard: 'Dashibodi',
      properties: 'Miradi',
      tenants: 'Wapangaji',
      sms: 'SMS',
      topup: 'Ongeza Salio',
      logout: 'Toka'
    },
    // Common
    common: {
      cancel: 'Ghairi',
      save: 'Hifadhi',
      delete: 'Futa',
      edit: 'Hariri',
      add: 'Ongeza',
      loading: 'Inapakia...',
      success: 'Imefanikiwa',
      error: 'Hitilafu imetokea',
      back: 'Rudi Nyuma',
    },
    // Auth
    auth: {
      login_title: 'Ingia Simamia Pro',
      login_subtitle: 'Dhibiti mali zako kwa urahisi zaidi',
      register_title: 'Jiunge Simamia Pro',
      register_subtitle: 'Tengeneza akaunti kuanza',
      email: 'Barua Pepe',
      password: 'Nenosiri',
      phone: 'Namba ya Simu',
      otp: 'Namba ya Siri (OTP)',
      send_otp: 'Tuma Namba ya Siri',
      verify_otp: 'Thibitisha Namba ya Siri',
      login_btn: 'Ingia',
      register_btn: 'Tengeneza Akaunti',
      no_account: 'Hauna akaunti?',
      has_account: 'Tayari una akaunti?',
      logging_in: 'Inaingia...',
      registering: 'Inatengeneza...',
      sending: 'Inatuma...',
      verifying: 'Inathibitisha...',
    },
    // Dashboard
    dashboard: {
      welcome: 'Karibu,',
      metrics: {
        total_properties: 'Jumla ya Miradi',
        total_units: 'Vyumba / Nyumba',
        occupied_units: 'Zilizopangishwa',
        total_tenants: 'Wapangaji',
      },
      rent_status: {
        title: 'Hali ya Kodi (Siku 30 zijazo)',
        no_tenants: 'Hakuna wapangaji bado',
        due_soon: 'Zimebaki',
        days: 'siku',
        today: 'Leo',
        overdue: 'Imezidi siku',
      },
      premium_banner: {
        title: 'Premium Inahitajika',
        desc: 'Pata kifurushi cha premium kuona taarifa zote na kutuma SMS za mawaidha.',
        btn: 'Boresha Akaunti',
      }
    },
    // Properties -> Projects
    properties: {
      title: 'Miradi Yangu',
      add_new: 'Ongeza Mradi',
      no_properties: 'Hujajaza mradi wowote.',
      add_first: 'Ongeza mradi wako wa kwanza kuanza kudhibiti.',
      form: {
        name: 'Jina la Mradi',
        location: 'Eneo (Mtaa/Wilaya)',
      }
    },
    // Units
    units: {
      title: 'Vyumba / Nyumba',
      add_new: 'Ongeza Chumba / Kitengo',
      monthly_rent: 'Kodi kwa Mwezi',
      form: {
        type: 'Aina ya Kitengo',
        custom_name: 'Jina la Chumba / Kitengo',
        custom_name_placeholder: 'mfano: Frame A1, Chumba 3B',
        status: 'Hali ya Chumba',
        upload_photo: 'Bonyeza kupakia picha',
        limit_reached: 'Kikomo Kimefikiwa',
        limit_desc: 'Free Version inaruhusu vyumba 5 tu. Panda daraja la Premium kupata nafasi zaidi.',
        upgrade_btn: 'Panda Premium →',
        photo_error: 'Picha haikupakia:',
        types: {
          apartment: 'Ghorofa / Apartment',
          house: 'Nyumba Nzima',
          commercial: 'Fremu ya Biashara',
          swahili_room: 'Chumba Uswahilini',
          hostel_room: 'Chumba cha Hostel',
          bedsitter: 'Bedsitter / Studio',
        }
      },
      status: {
        occupied: 'Kimepangishwa',
        vacant: 'Kipo Wazi'
      }
    },
    // Tenants
    tenants: {
      title: 'Wapangaji Wangu',
      add_new: 'Ongeza Mpangaji',
      table: {
        name: 'Jina',
        phone: 'Namba ya Simu',
        property: 'Mali & Chumba',
        rent_due: 'Siku ya Kulipa',
        actions: 'Vitendo'
      },
      form: {
        name: 'Jina Kamili',
        phone: 'Namba ya Simu',
        rent_due_day: 'Tarehe ya Kulipa (1-31)',
        move_in_date: 'Tarehe ya Kuingia',
        lease_end: 'Tarehe ya Kumaliza Mkataba (Hiari)'
      }
    },
    // SMS
    sms: {
      title: 'Kituo cha SMS',
      credits: 'Salio la SMS:',
      buy_credits: 'Nunua SMS',
      broadcast: 'Tuma Tangazo',
      history: 'Historia ya SMS',
      table: {
        date: 'Tarehe',
        recipient: 'Mpokeaji',
        message: 'Ujumbe',
        cost: 'Gharama',
        status: 'Hali'
      },
      premium_locked: 'Kipengele cha Premium. Boresha akaunti kutumia SMS.',
      broadcast_dialog: {
        title: 'Tuma Tangazo (Wapangaji Wote)',
        desc: 'Ujumbe huu utatumwa kwa wapangaji wako wote.',
        message: 'Ujumbe wako',
        send: 'Tuma Tangazo'
      }
    },
    // Topup
    topup: {
      title: 'Ongeza Salio la SMS',
      desc: 'Nunua credits za SMS kuendelea kuwasiliana na wapangaji wako na kupata Premium.',
      premium_promo: 'Taka Kuwa Premium?',
      premium_desc: 'Nunua credits 50 au zaidi na utume risiti ukiandika "PREMIUM" — akaunti yako itapandishwa kiotomatiki.',
      lipa_namba: 'Lipa Namba (M-Pesa)',
      name: 'Jina',
      amount: 'Kiasi',
      whatsapp: 'Tuma Risiti WhatsApp',
      packages: {
        small: '50 Credits (Mwezi 1 Premium)',
        medium: '100 Credits (Miezi 2 Premium)',
        large: '500 Credits (Mwaka 1 Premium)'
      }
    },
    // Landing Page
    landing: {
      hero_badge: 'Jukwaa #1 la Usimamizi wa Mali Tanzania',
      hero_title_1: 'Simamia Nyumba zako za kupangisha',
      hero_title_2: 'kwa Ufanisi Kidigitali',
      hero_desc: 'Jukwaa la kisasa kwa wamiliki wa nyumba Tanzania — simamia nyumba, wapangaji, na ukusanyaji wa kodi yote katika sehemu moja salama na rahisi.',
      cta_start: 'Anza Sasa — Bila Malipo',
      cta_login: 'Tayari Una Akaunti? Ingia',
      features_title: 'Kila Kitu Unachohitaji',
      features_desc: 'Zana za kisasa zilizoundwa mahususi kwa wamiliki wa nyumba Tanzania.',
      feat_properties_title: 'Usimamizi wa Mali',
      feat_properties_desc: 'Ongeza na usimamie nyumba, ghorofa, na fremu zako zote katika sehemu moja.',
      feat_tenants_title: 'Dhibiti Wapangaji',
      feat_tenants_desc: 'Fuatilia wapangaji, mikataba, tarehe za kulipa kodi, na mawasiliano yao.',
      feat_sms_title: 'SMS za Otomatiki',
      feat_sms_desc: 'Tuma mawaidha ya kodi kiotomatiki kupitia SMS kwa wapangaji wako wote.',
      feat_mpesa_title: 'Malipo ya M-Pesa',
      feat_mpesa_desc: 'Pokea malipo ya kodi kupitia M-Pesa na ufuatilie kiotomatiki.',
      social_proof: 'Wamiliki zaidi ya 500 tayari wanatumia Simamia Pro kusimamia mali zao.',
      footer_tagline: 'Usimamizi wa mali wenye akili kwa wamiliki wa nyumba Tanzania.',
      footer_product: 'Bidhaa',
      footer_support: 'Msaada',
      footer_legal: 'Kisheria',
      footer_contact: 'Wasiliana Nasi',
      footer_privacy: 'Sera ya Faragha',
      footer_terms: 'Masharti ya Matumizi',
      footer_rights: 'Haki zote zimehifadhiwa.',
    }
  },
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      properties: 'Projects',
      tenants: 'Tenants',
      sms: 'SMS',
      topup: 'Top Up',
      logout: 'Log Out'
    },
    // Common
    common: {
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      loading: 'Loading...',
      success: 'Success',
      error: 'An error occurred',
      back: 'Go Back',
    },
    // Auth
    auth: {
      login_title: 'Login to Simamia Pro',
      login_subtitle: 'Manage your properties with ease',
      register_title: 'Join Simamia Pro',
      register_subtitle: 'Create an account to get started',
      email: 'Email',
      password: 'Password',
      phone: 'Phone Number',
      otp: 'One-Time Password (OTP)',
      send_otp: 'Send OTP',
      verify_otp: 'Verify OTP',
      login_btn: 'Sign In',
      register_btn: 'Create Account',
      no_account: 'Don\'t have an account?',
      has_account: 'Already have an account?',
      logging_in: 'Signing in...',
      registering: 'Creating account...',
      sending: 'Sending...',
      verifying: 'Verifying...',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome,',
      metrics: {
        total_properties: 'Total Projects',
        total_units: 'Total Units',
        occupied_units: 'Occupied Units',
        total_tenants: 'Total Tenants',
      },
      rent_status: {
        title: 'Rent Status (Next 30 Days)',
        no_tenants: 'No tenants yet',
        due_soon: 'Due in',
        days: 'days',
        today: 'Today',
        overdue: 'Overdue by',
      },
      premium_banner: {
        title: 'Premium Required',
        desc: 'Upgrade to a premium plan to see all insights and send automated SMS reminders.',
        btn: 'Upgrade Account',
      }
    },
    // Properties -> Projects
    properties: {
      title: 'My Projects',
      add_new: 'Add Project',
      no_properties: 'You have not added any projects yet.',
      add_first: 'Add your first project to start managing.',
      form: {
        name: 'Project Name',
        location: 'Location (Street/District)',
      }
    },
    // Units
    units: {
      title: 'Units / Rooms',
      add_new: 'Add Unit',
      monthly_rent: 'Monthly Rent',
      form: {
        type: 'Unit Type',
        custom_name: 'Unit Name / Number',
        custom_name_placeholder: 'e.g., Shop A1, Room 3B',
        status: 'Unit Status',
        upload_photo: 'Click to upload photo',
        limit_reached: 'Limit Reached',
        limit_desc: 'Free Version allows only 5 units. Upgrade to Premium for unlimited space.',
        upgrade_btn: 'Upgrade to Premium →',
        photo_error: 'Photo failed to upload:',
        types: {
          apartment: 'Apartment',
          house: 'Standalone House',
          commercial: 'Shop / Commercial',
          swahili_room: 'Swahili Room',
          hostel_room: 'Hostel Room',
          bedsitter: 'Bedsitter / Studio',
        }
      },
      status: {
        occupied: 'Occupied',
        vacant: 'Vacant'
      }
    },
    // Tenants
    tenants: {
      title: 'My Tenants',
      add_new: 'Add Tenant',
      table: {
        name: 'Name',
        phone: 'Phone Number',
        property: 'Property & Unit',
        rent_due: 'Rent Due Day',
        actions: 'Actions'
      },
      form: {
        name: 'Full Name',
        phone: 'Phone Number',
        rent_due_day: 'Rent Due Date (1-31)',
        move_in_date: 'Move-in Date',
        lease_end: 'Lease End Date (Optional)'
      }
    },
    // SMS
    sms: {
      title: 'SMS Center',
      credits: 'SMS Balance:',
      buy_credits: 'Buy SMS',
      broadcast: 'Send Broadcast',
      history: 'SMS History',
      table: {
        date: 'Date',
        recipient: 'Recipient',
        message: 'Message',
        cost: 'Cost',
        status: 'Status'
      },
      premium_locked: 'Premium feature. Upgrade your account to use SMS.',
      broadcast_dialog: {
        title: 'Send Broadcast (All Tenants)',
        desc: 'This message will be sent to all your tenants.',
        message: 'Your Message',
        send: 'Send Broadcast'
      }
    },
    // Topup
    topup: {
      title: 'Top Up SMS Balance',
      desc: 'Buy SMS credits to keep communicating with your tenants and get Premium access.',
      premium_promo: 'Want to be Premium?',
      premium_desc: 'Buy 50 credits or more and send the receipt writing "PREMIUM" — your account will be upgraded automatically.',
      lipa_namba: 'Lipa Namba (M-Pesa)',
      name: 'Name',
      amount: 'Amount',
      whatsapp: 'Send Receipt via WhatsApp',
      packages: {
        small: '50 Credits (1 Month Premium)',
        medium: '100 Credits (2 Months Premium)',
        large: '500 Credits (1 Year Premium)'
      }
    },
    // Landing Page
    landing: {
      hero_badge: '#1 Property Management Platform in Tanzania',
      hero_title_1: 'Manage Your Properties',
      hero_title_2: 'Smartly & Effortlessly',
      hero_desc: 'A modern platform for Tanzanian landlords — manage properties, tenants, and rent collection all in one secure and easy place.',
      cta_start: 'Get Started — It\'s Free',
      cta_login: 'Already Have an Account? Sign In',
      features_title: 'Everything You Need',
      features_desc: 'Modern tools built specifically for Tanzanian landlords.',
      feat_properties_title: 'Property Management',
      feat_properties_desc: 'Add and manage all your houses, apartments, and commercial frames in one place.',
      feat_tenants_title: 'Tenant Tracking',
      feat_tenants_desc: 'Track tenants, leases, rent due dates, and their contact information.',
      feat_sms_title: 'Automated SMS',
      feat_sms_desc: 'Send automatic rent reminders via SMS to all your tenants.',
      feat_mpesa_title: 'M-Pesa Payments',
      feat_mpesa_desc: 'Receive rent payments via M-Pesa and track them automatically.',
      social_proof: 'Over 500 landlords are already using Simamia Pro to manage their properties.',
      footer_tagline: 'Smart property management for Tanzanian landlords.',
      footer_product: 'Product',
      footer_support: 'Support',
      footer_legal: 'Legal',
      footer_contact: 'Contact Us',
      footer_privacy: 'Privacy Policy',
      footer_terms: 'Terms of Service',
      footer_rights: 'All rights reserved.',
    }
  }
}

export type Dictionary = typeof dictionaries.en
