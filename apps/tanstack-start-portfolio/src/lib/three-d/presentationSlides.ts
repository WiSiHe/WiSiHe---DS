import type { PresentationSlide } from './types';

export const presentationSlides: PresentationSlide[] = [
  {
    title: 'Meet Your Guide & The Mission',
    subtitle: 'Henrik Wilhelm Sissener - Frontend Developer @NOA-IGNITE',
    content: [
      'Passionate about the intersection of art, code, and user experience.',
      'Interests: Game development, interactive art, and finding simpler ways to build cool things.',
    ],
    type: 'content',
    image: '/images/portrait-stylized.png',
    category: 'Introduction',
  },
  {
    title: 'Why This Talk?',
    content: [
      'I attended Awwwards Conf and was inspired by the potential of web 3D.',
      'But I saw a gap: The tools often seemed too complex for everyday projects.',
      'Today at NoA Ignite, my goal is to bridge that gap and show you a faster, more intuitive path into 3D.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing the gap between complex tools and accessible solutions
    // Image should represent: "Bridging the gap" or "Making 3D accessible"
    image: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
    category: 'Introduction',
  },
  {
    title: 'What is 3D?',
    subtitle: 'You Experience It Every Day',
    content: [
      '3D (three-dimensional) adds depth to flat 2D screens',
      'Everyday examples:',
      '• Video games with realistic environments',
      '• Product configurators on shopping sites',
      '• Virtual tours of real estate',
      '• AR filters on social media',
      '• Medical visualizations and training',
      '• Architectural walkthroughs',
      '',
      '3D makes digital experiences feel more real and interactive',
    ],
    type: 'content',
    category: 'Introduction',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Collage or illustration showing multiple everyday 3D examples
    // Image should represent: "Everyday 3D experiences" or "3D in daily life"
    image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
  },
  {
    title: 'Awwwards Conference Workshop',
    subtitle: 'Amsterdam 2024',
    content: [
      'This interactive presentation was created for a workshop at the Awwwards Conference in Amsterdam.',
      'The goal was to demystify 3D on the web and show developers how accessible it has become with modern tools.',
      'During the workshop, Bruno Simon (creator of Three.js Journey) led a session on shaders using pure Three.js.',
      "This presentation itself serves as a live example of what's possible with React Three Fiber and modern web 3D.",
    ],
    type: 'content',
    iframe: 'https://workshop-shaders.vercel.app/',
    category: 'Introduction',
    sources: [
      { text: 'Awwwards Conference', url: 'https://www.awwwards.com/conference' },
      { text: 'Bruno Simon Portfolio', url: 'https://bruno-simon.com/' },
      { text: 'Three.js Journey', url: 'https://threejs-journey.com/' },
    ],
  },
  {
    title: 'The Problem',
    type: 'separator',
    content: null,
    category: 'The Problem',
  },
  {
    title: 'The Old Frontier: Why 3D Felt So Hard',
    content: [
      'Historically, it involved complex desktop software (Blender, 3DS Max).',
      'Steep learning curves and specialized skills were required.',
      'Implementation was code-heavy (Three.js, WebGL).',
      'The workflow was slow and disconnected between designers and developers.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing traditional 3D workflow complexity
    // Image should represent: "Complex desktop software" or "Steep learning curve"
    image: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
    category: 'The Problem',
  },
  {
    title: 'Traditional vs Modern: The Pipeline Comparison',
    subtitle: 'Two Different Worlds',
    content: [
      'Traditional Pipeline:',
      '• Design in Blender (complex desktop software)',
      '• Export to GLTF/OBJ format',
      '• Write Three.js code to load and render',
      '• Optimize for web performance',
      '• Requires both design AND development skills',
      '',
      'Modern Pipeline:',
      '• Design in Spline (web-based, intuitive)',
      '• Direct web export - no code needed',
      '• Publish and embed in minutes',
      '• Accessible to designers without coding',
      '• Faster iteration and collaboration',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Side-by-side comparison diagram showing Traditional vs Modern pipeline
    // Image should represent: "Pipeline comparison" or "Workflow visualization"
    image: 'https://media.giphy.com/media/3o7aD2saX2qRlZe8I0/giphy.gif',
    category: 'The Problem',
  },
  {
    title: 'History',
    type: 'separator',
    content: null,
    category: 'History',
  },
  {
    title: 'A Brief History of Web 3D',
    subtitle: '1995-2010: The Plugin Era',
    content: [
      'Early attempts with VRML and Flash required clunky plugins,',
      'creating a slow and inconsistent user experience.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration of early web 3D (VRML, Flash plugins)
    // Image should represent: "Plugin era" or "Early web 3D attempts"
    image: 'https://media.giphy.com/media/l0HlNQ03f4h1x8s2k/giphy.gif',
    category: 'History',
    chartType: 'history-timeline',
    currentEra: '1995-2010',
  },
  {
    title: 'A Brief History of Web 3D',
    subtitle: '2011: The Big Bang',
    content: [
      'The arrival of WebGL changes everything.',
      '3D graphics can now run natively in the browser, no plugins needed.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing WebGL introduction
    // Image should represent: "WebGL launch" or "Native browser 3D"
    image: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif',
    category: 'History',
    chartType: 'history-timeline',
    currentEra: '2011',
  },
  {
    title: 'A Brief History of Web 3D',
    subtitle: 'Mid-2010s: The Tool-Building Era',
    content: [
      'Libraries like Three.js make WebGL accessible to millions of web developers',
      'by simplifying its complexity.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing Three.js library
    // Image should represent: "Three.js emergence" or "Tool-building era"
    image: 'https://media.giphy.com/media/3o7aD2saX2qRlZe8I0/giphy.gif',
    category: 'History',
    chartType: 'history-timeline',
    currentEra: 'Mid-2010s',
  },
  {
    title: 'A Brief History of Web 3D',
    subtitle: '2020s: The Modern Era',
    content: [
      'React Three Fiber brings declarative 3D to React developers.',
      'Modern tools and frameworks make 3D creation faster and more accessible than ever.',
      'WebGPU is emerging as the next evolution of web graphics.',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing React Three Fiber and modern tools
    // Image should represent: "Modern era" or "React Three Fiber"
    image: 'https://media.giphy.com/media/l0MYC0Lajbo2eKf2g/giphy.gif',
    category: 'History',
    chartType: 'history-timeline',
    currentEra: '2020s',
  },
  {
    title: 'Business Impact',
    type: 'separator',
    content: null,
    category: 'Business Impact',
  },
  {
    title: 'The "Why": The Business Impact of 3D',
    subtitle: 'Sell More',
    content: [
      'Shopify merchants who use 3D commerce experience',
      'an average 94% increase in conversions.',
      'Interactive 3D lets customers explore products from every angle,',
      'building confidence and reducing purchase hesitation.',
    ],
    type: 'content',
    sources: [
      { text: 'Shopify - 3D Ecommerce Blog', url: 'https://www.shopify.com/blog/3d-ecommerce' },
      {
        text: 'Threekit - ROI of 3D and AR',
        url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
      },
    ],
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing e-commerce with 3D products
    // Image should represent: "Increased conversions" or "3D product visualization"
    image: 'https://media.giphy.com/media/3o7aD2saX2qRlZe8I0/giphy.gif',
    category: 'Business Impact',
    chartType: 'business-impact',
  },
  {
    title: 'The "Why": The Business Impact of 3D',
    subtitle: 'Return Less',
    content: [
      "When customers know exactly what they're getting,",
      'returns drop by -40% by bridging the "imagination gap."',
      '3D visualization eliminates the disconnect between',
      'what customers expect and what they receive.',
    ],
    type: 'content',
    sources: [
      { text: 'Shopify - 3D Ecommerce Blog', url: 'https://www.shopify.com/blog/3d-ecommerce' },
      {
        text: 'Threekit - ROI of 3D and AR',
        url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
      },
    ],
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing reduced returns
    // Image should represent: "Reduced returns" or "Better product visualization"
    image: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
    category: 'Business Impact',
    chartType: 'business-impact',
  },
  {
    title: 'The "Why": The Business Impact of 3D',
    subtitle: 'Save Money',
    content: [
      'Virtual rendering eliminates the need for physical photography shoots.',
      'Save -99% on photography costs by rendering products virtually',
      'instead of shooting them physically.',
      'Update product visuals instantly without reshooting.',
    ],
    type: 'content',
    sources: [
      {
        text: 'Threekit - ROI of 3D and AR',
        url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
      },
      {
        text: 'Threekit - eCommerce Guide to ROI',
        url: 'https://www.threekit.com/download-the-ecommerce-guide-to-roi-in-3d-and-augmented-reality-ebook',
      },
    ],
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing virtual rendering vs photography
    // Image should represent: "Cost savings" or "Virtual rendering"
    image: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
    category: 'Business Impact',
    chartType: 'business-impact',
  },
  {
    title: 'Tools & Performance',
    type: 'separator',
    content: null,
    category: 'Tools & Performance',
  },
  {
    title: 'Tools & Resources',
    subtitle: 'The 3D Toolkit',
    content: [
      'A curated list of essential tools and libraries for building 3D experiences on the web.',
      'From modeling software to JavaScript libraries, these tools make 3D development accessible and powerful.',
    ],
    type: 'content',
    tools: [
      {
        name: 'Blender',
        description:
          'Free and open-source 3D creation suite for modeling, animation, rendering, and more.',
        url: 'https://www.blender.org/',
        category: '3D Modeling',
        nerdLevel: 3,
      },
      {
        name: 'Spline',
        description:
          "Web-based 3D design tool for creating interactive 3D experiences without code. Perfect for those who don't want to learn Three.js - build an interactive rocketship and publish it online in less than 40 minutes!",
        url: 'https://spline.design/',
        category: '3D Design',
        workshopUrl:
          'https://thenorthalliance.notion.site/Spline-Workshop-1b2cf2f6604a8079876bd7b025269ed5',
        nerdLevel: 1,
      },
      {
        name: 'Three.js',
        description:
          'JavaScript 3D library that makes WebGL accessible. The industry standard for web 3D.',
        url: 'https://threejs.org/',
        category: 'Library',
        nerdLevel: 4,
      },
      {
        name: 'React Three Fiber',
        description:
          'React renderer for Three.js. Declarative 3D in React with hooks and components.',
        url: 'https://docs.pmnd.rs/react-three-fiber',
        category: 'Library',
        nerdLevel: 4,
      },
      {
        name: '@react-three/drei',
        description:
          'Useful helpers for React Three Fiber. Pre-built components, controls, and utilities.',
        url: 'https://github.com/pmndrs/drei',
        category: 'Library',
        nerdLevel: 3,
      },
      {
        name: 'WebGL / WebGPU',
        description:
          'Low-level graphics APIs that power 3D on the web. Hardware-accelerated rendering.',
        url: 'https://www.khronos.org/webgl/',
        category: 'API',
        nerdLevel: 5,
      },
    ],
    category: 'Tools & Performance',
  },
  {
    title: "Performance: The Numbers Don't Lie",
    subtitle: 'Real Talk 📊',
    content: [
      'Modern WebGL is hardware-accelerated (uses your GPU, not CPU)',
      'A well-optimized 3D scene can load in under 2 seconds',
      'Bundle size: Often smaller than a single hero image (50-200KB)',
      'Well-optimized 3D scenes run at 60 FPS smoothly',
      'Lazy loading and code splitting keep initial bundle sizes small',
      'Progressive enhancement ensures graceful degradation',
      '',
      'But 3D comes with costs:',
      '• Increased GPU usage and potential battery drain on mobile devices',
      '• Higher bundle size compared to simple 2D interfaces',
      '• Not all devices can handle complex 3D scenes smoothly',
      '• Development time can be longer than traditional 2D interfaces',
      '• Browser compatibility considerations (WebGL vs WebGPU)',
    ],
    type: 'content',
    category: 'Tools & Performance',
    chartType: 'performance',
  },
  {
    title: 'Why Use 3D? Reason #1: Stand Out',
    subtitle: 'Be the Unicorn 🦄',
    content: [
      'Most websites look the same—boring rectangles and grids',
      '3D makes you memorable—people actually remember your site',
      'Shareability: "Did you see that cool 3D thing?"',
      'First impressions matter, and 3D = instant "wow" factor',
    ],
    type: 'content',
    image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    category: 'Why Use 3D?',
  },
  {
    title: 'Why Use 3D? Reason #2: Engagement',
    subtitle: 'People Actually Stay 🎯',
    content: [
      '82% of users play with the 3D model when given the chance',
      '40% of online shoppers are willing to pay more for 3D experiences',
      '5x longer average session times',
      'Interactive = engaging (click, drag, explore!)',
      'Reduces bounce rate: visitors want to see what happens next',
      'Interactive 3D creates deeper engagement than static images or videos',
      "It's fun! And fun = memorable = conversions",
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing interactive 3D engagement
    // Image should represent: "User engagement" or "Interactive 3D experience"
    image: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    sources: [
      { text: 'Shopify - 3D Ecommerce Blog', url: 'https://www.shopify.com/blog/3d-ecommerce' },
      {
        text: 'Threekit - ROI of 3D and AR',
        url: 'https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality',
      },
      {
        text: 'BigCommerce - 3D Visualization',
        url: 'https://www.bigcommerce.com/blog/3d-visualization/',
      },
      {
        text: 'Virsabi - Increase conversions with 94%',
        url: 'https://virsabi.com/increase-conversions-in-online-shops-with-94/',
      },
    ],
    category: 'Why Use 3D?',
    chartType: 'engagement',
  },
  {
    title: 'Why Use 3D? Reason #3: Better UX',
    subtitle: "Show, Don't Tell 📦",
    content: [
      "Product configurators: customers see exactly what they're buying",
      'Architecture: walk through spaces before they exist',
      'Education: visualize complex concepts (molecules, anatomy, etc.)',
      "Data visualization: 3D charts reveal patterns 2D can't show",
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot or illustration showing product configurator or 3D visualization
    // Image should represent: "Better UX" or "3D product visualization"
    image: 'https://media.giphy.com/media/l0HlNQ03f4h1x8s2k/giphy.gif',
    category: 'Why Use 3D?',
  },
  {
    title: "Why Use 3D? Reason #4: It's Actually Accessible Now",
    subtitle: 'No PhD Required 🎓',
    content: [
      'React Three Fiber: Write 3D like you write React components',
      'Extensive documentation and community support',
      'Templates and examples everywhere',
      'The barrier to entry is lower than ever',
    ],
    type: 'content',
    image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    category: 'Why Use 3D?',
  },
  {
    title: 'Considerations & Limitations',
    subtitle: 'The Other Side of 3D',
    content: [
      'Accessibility: 3D interfaces can be challenging for screen readers and keyboard navigation.',
      'Performance: Not all devices can handle complex 3D scenes smoothly, especially older or low-end devices.',
      'Motion Sensitivity: Some users may experience motion sickness or discomfort with 3D animations and camera movements.',
      "Progressive Enhancement: Always provide fallbacks for users who can't or don't want 3D experiences.",
      'SEO: 3D content is harder for search engines to index and understand compared to traditional HTML content.',
      'Development Complexity: 3D projects often require more specialized knowledge and longer development cycles.',
    ],
    type: 'content',
    category: 'Why Use 3D?',
  },
  {
    title: 'Examples',
    type: 'separator',
    content: null,
    category: 'Examples',
  },
  {
    title: 'Real-World Success Stories',
    subtitle: '3D in Action',
    content: [
      "These industry leaders prove that 3D isn't just a gimmick—it's a powerful tool that drives real business results.",
    ],
    type: 'content',
    category: 'Examples',
    examples: [
      {
        name: 'IKEA Place',
        description:
          'AR furniture placement transforms shopping by letting customers visualize products in their actual homes.',
        // TODO: Replace Giphy placeholder with actual screenshot of IKEA Place app
        // Image should be: Screenshot of IKEA Place AR interface showing furniture placement
        image: 'https://media.giphy.com/media/3o7aD2saX2qRlZe8I0/giphy.gif',
        url: 'https://www.ikea.com/us/en/customer-service/mobile-apps/ikea-place/',
      },
      {
        name: 'Nike',
        description:
          '3D shoe customization and virtual try-on create engaging experiences that reduce returns and increase satisfaction.',
        // TODO: Replace Giphy placeholder with actual screenshot of Nike 3D customization
        // Image should be: Screenshot of Nike's 3D shoe configurator or virtual try-on
        image: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        url: 'https://www.nike.com/',
      },
      {
        name: 'Warby Parker',
        description:
          'Virtual try-on for glasses eliminates guesswork, helping customers find the perfect fit from home.',
        // TODO: Replace Giphy placeholder with actual screenshot of Warby Parker virtual try-on
        // Image should be: Screenshot of Warby Parker's virtual try-on interface
        image: 'https://media.giphy.com/media/l0HlNQ03f4h1x8s2k/giphy.gif',
        url: 'https://www.warbyparker.com/',
      },
      {
        name: 'BMW',
        description:
          'Interactive 3D car configurators let customers customize every detail, creating emotional connection before purchase.',
        // TODO: Replace Giphy placeholder with actual screenshot of BMW car configurator
        // Image should be: Screenshot of BMW's 3D car configurator interface
        image: 'https://media.giphy.com/media/3o7aD2saX2qRlZe8I0/giphy.gif',
        url: 'https://www.bmw.com/',
      },
    ],
    sources: [
      {
        text: 'IKEA Place - AR Furniture',
        url: 'https://www.ikea.com/us/en/customer-service/mobile-apps/ikea-place/',
      },
      {
        text: 'Nike - 3D Customization',
        url: 'https://www.nike.com/',
      },
      {
        text: 'Warby Parker - Virtual Try-On',
        url: 'https://www.warbyparker.com/',
      },
      {
        text: 'BMW - Car Configurator',
        url: 'https://www.bmw.com/',
      },
    ],
  },
  {
    title: 'Workshop: Shaders with Bruno Simon',
    subtitle: 'Three.js Journey Creator',
    content: [
      'Bruno Simon, creator of Three.js Journey, led a workshop on shaders at the Awwwards Conference.',
      'This interactive demo showcases advanced shader techniques using pure Three.js (not React Three Fiber).',
      "It demonstrates the flexibility of the Three.js ecosystem and what's possible with shaders.",
      "Bruno's portfolio is a stunning example of what can be built with Three.js and creative development.",
    ],
    type: 'content',
    category: 'Examples',
    sources: [
      { text: 'Bruno Simon Portfolio', url: 'https://bruno-simon.com/' },
      { text: 'Three.js Journey', url: 'https://threejs-journey.com/' },
    ],
  },
  {
    title: 'Conclusion',
    subtitle: 'The Future is 3D',
    content: [
      'This is a live, interactive 3D scene that works on any modern browser.',
      'Built with React Three Fiber and Three.js.',
      'Ready to explore the technical details?',
    ],
    type: 'content',
    // TODO: Replace Giphy placeholder with actual image
    // Suggested: Screenshot of this presentation's 3D scene or a call-to-action visual
    // Image should represent: "Interactive 3D scene" or "Future of 3D web"
    image: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
    category: 'Conclusion',
  },
];
