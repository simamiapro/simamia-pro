export type Locale = 'sw' | 'en'

export const dictionaries = {
  sw: {
    // Navigation
    nav: {
      dashboard: 'Dashibodi',
      properties: 'Mali',
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
      login_btn: 'Ingia',
      register_btn: 'Tengeneza Akaunti',
      no_account: 'Hauna akaunti?',
      has_account: 'Tayari una akaunti?',
      logging_in: 'Inaingia...',
      registering: 'Inatengeneza...',
    },
    // Dashboard
    dashboard: {
      welcome: 'Karibu,',
      metrics: {
        total_properties: 'Jumla ya Mali',
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
    // Properties
    properties: {
      title: 'Mali Zangu',
      add_new: 'Ongeza Mali',
      no_properties: 'Hujajaza mali yoyote.',
      add_first: 'Ongeza mali yako ya kwanza kuanza kudhibiti.',
      form: {
        name: 'Jina la Mali',
        location: 'Eneo (Mtaa/Wilaya)',
        type: 'Aina ya Mali',
        types: {
          apartment: 'Ghorofa / Vyumba (Apartment)',
          house: 'Nyumba ya Kujitegemea',
          commercial: 'Fremu / Biashara'
        }
      }
    },
    // Units
    units: {
      title: 'Vyumba / Nyumba',
      add_new: 'Ongeza Chumba',
      monthly_rent: 'Kodi kwa Mwezi',
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
    }
  },
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      properties: 'Properties',
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
      login_btn: 'Sign In',
      register_btn: 'Create Account',
      no_account: 'Don\'t have an account?',
      has_account: 'Already have an account?',
      logging_in: 'Signing in...',
      registering: 'Creating account...',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome,',
      metrics: {
        total_properties: 'Total Properties',
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
    // Properties
    properties: {
      title: 'My Properties',
      add_new: 'Add Property',
      no_properties: 'No properties added yet.',
      add_first: 'Add your first property to start managing.',
      form: {
        name: 'Property Name',
        location: 'Location (Street/District)',
        type: 'Property Type',
        types: {
          apartment: 'Apartment',
          house: 'Standalone House',
          commercial: 'Commercial / Frame'
        }
      }
    },
    // Units
    units: {
      title: 'Units',
      add_new: 'Add Unit',
      monthly_rent: 'Monthly Rent',
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
    }
  }
}

export type Dictionary = typeof dictionaries.en
