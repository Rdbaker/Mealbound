interface HowItWorksText {
  header: string;
  buyersHeader: string;
  sellersHeader: string;
  buyersCTA: string;
  sellersCTA: string;
  searchHeader: string;
  searchDescription: string;
  payHeader: string;
  payDescription: string;
  pickupHeader: string;
  pickupDescription: string;
  rateHeader: string;
  rateDescription: string;
  locateHeader: string;
  locateDescription: string;
  setHeader: string;
  setDescription: string;
  bringHeader: string;
  bringDescription: string;
  earnHeader: string;
  earnDescription: string;
}

interface LandingPageState {
  tagline: string;
  loginCTA: string;
  registerCTA: string;
  videoFailText: string;
  searchDropdownText: string;
  postAuthNextURL: string;
  howItWorksText: HowItWorksText;
}


export function defaultLandingPageState() : LandingPageState {
  return {
    tagline: 'Buy and sell homecooked meals',
    loginCTA: 'Login',
    registerCTA: 'Sign Up',
    videoFailText: 'Your browser does not support the video tag. We recommend upgrading your browser.',
    searchDropdownText: 'Search for a meal right now',
    postAuthNextURL: '',
    howItWorksText: {
      header: 'How it works',
      buyersHeader: 'Buyers',
      sellersHeader: 'Sellers',
      buyersCTA: 'Start Eating!',
      sellersCTA: 'Start Selling!',
      searchHeader: 'Search',
      searchDescription: 'based on things like time of day and type of food',
      payHeader: 'Pay',
      payDescription: 'using any major credit or debit card',
      pickupHeader: 'Pickup',
      pickupDescription: 'the meal from an agreed upon location',
      rateHeader: 'Rate',
      rateDescription: 'the seller based on your experience',
      locateHeader: 'Locate',
      locateDescription: 'where you want the pickup to be',
      setHeader: 'Set',
      setDescription: 'price, and categorize your meal so it can be found',
      bringHeader: 'Bring',
      bringDescription: 'the food to the location (if it\'s not near you)',
      earnHeader: 'Earn',
      earnDescription: 'by adding more food to meals you\'re already cooking',
    },
  };
}

export default LandingPageState;
