export const NewsService = {
  // Wikipedia API Endpoint (Supports CORS)
  WIKI_API: 'https://ko.wikipedia.org/w/api.php',
  
  // Mapping interests to good Wikipedia search queries
  SEARCH_QUERIES: {
    'IT/기술': '인공지능|컴퓨터 과학|스마트폰|메타버스|로봇공학|자율주행|디지털',
    '건강': '건강|운동|의학|영양소|정신 건강|수면|질환',
    '과학': '과학|우주|물리학|생물학|화학|지구과학|유전학',
    '경제': '경제|금융|주식 시장|가상화폐|기업|무역|스타트업',
    '경제/금융': '경제|금융|주식 시장|가상화폐|기업|무역|스타트업',
    '예술': '예술|미술|음악|디자인|영화|건축|사진',
  },

  // Fallback Images by Category (Expanded to 20+ per category)
  FALLBACK_IMAGES: {
    'IT/기술': [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000', // Cyberpunk
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000', // Matrix code
      'https://images.unsplash.com/photo-1531297461136-82ae960ed3d2?auto=format&fit=crop&q=80&w=1000', // Phone
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', // Earth Network
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000', // Team coding
      'https://images.unsplash.com/photo-1550745165-90c23112fc71?auto=format&fit=crop&q=80&w=1000', // Circuit
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000', // AI Art
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=1000', // Drone
      'https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&q=80&w=1000', // Code
      'https://images.unsplash.com/photo-1535378437341-ace875663533?auto=format&fit=crop&q=80&w=1000', // VR
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000', // Robot
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000', // Laptop
      'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=1000', // Motherboard
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1000', // Data center
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000', // Coding laptop
      'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=1000', // Setup
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000', // Abstract Tech
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000', // Coding close up
    ],
    '건강': [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000', // Trainer
      'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&q=80&w=1000', // Fruit
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1000', // Food
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000', // Running
      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&q=80&w=1000', // Yoga
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000', // Gym
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=1000', // Gym 2 
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000', // Yoga 2
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=1000', // Healthy eating
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=1000', // Hospital/Medical
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000', // Doctor
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000', // Stethoscope
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1000', // Pills
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000', // Molecule
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=1000', // Biology
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000', // Lab
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000', // Scientist
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000', // Nature healing
    ],
    '과학': [
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1614728853913-1e32005e307a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', // Earth from space
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000', // Shuttle
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1000', // Nebula
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000', // Flask
      'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&q=80&w=1000', // Microscope
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1000', // Chemical
      'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1000', // Astronaut
      'https://images.unsplash.com/photo-1454789548728-85d2696cfb9e?auto=format&fit=crop&q=80&w=1000', // Stars
      'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=1000', // Data
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1000', // Math
      'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&q=80&w=1000', // Abstract
      'https://images.unsplash.com/photo-1501139083538-0139583c61ee?auto=format&fit=crop&q=80&w=1000', // Physics
      'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=1000', // Genome
      'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000', // Rocket
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000', // Technology
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000', // Math board
      'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=1000', // DNA
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000', // Virus
    ],
    '경제': [
      'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1554224155-1696413565db?auto=format&fit=crop&q=80&w=1000', // Accounting
      'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=1000', // Stocks
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000', // Coins
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000', // Chart
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=1000', // Money
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&q=80&w=1000', // Bitcoin
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000', // Report
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000', // Signing
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000', // Meeting
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000', // Suit
      'https://images.unsplash.com/photo-1532619187514-e51ef1dbfe18?auto=format&fit=crop&q=80&w=1000', // Office
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000', // Planning
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1000', // Money Exchange
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', // Digital Graph
      'https://images.unsplash.com/photo-1565514020176-db704f0d46d3?auto=format&fit=crop&q=80&w=1000', // Investment
      'https://images.unsplash.com/photo-1621261260031-6e3ba7793db5?auto=format&fit=crop&q=80&w=1000', // Crypto
      'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=1000', // Analysis
      'https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?auto=format&fit=crop&q=80&w=1000', // Savings
    ],
    '예술': [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&q=80&w=1000', // Paint
      'https://images.unsplash.com/photo-1460661619277-d60f346a2471?auto=format&fit=crop&q=80&w=1000', // Brush
      'https://images.unsplash.com/photo-1459749411177-d4fa17531af0?auto=format&fit=crop&q=80&w=1000', // Canvas
      'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&q=80&w=1000', // Gallery
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=1000', // Museum
      'https://images.unsplash.com/photo-1514533248646-60aa6dc09c91?auto=format&fit=crop&q=80&w=1000', // Sculpture
      'https://images.unsplash.com/photo-1514933651144-1d0b13824f8d?auto=format&fit=crop&q=80&w=1000', // Classic
      'https://images.unsplash.com/photo-1552317804-03a0b411da33?auto=format&fit=crop&q=80&w=1000', // Modern Art
      'https://images.unsplash.com/photo-1507676184212-d03ab07a11d0?auto=format&fit=crop&q=80&w=1000', // Pencil
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=1000', // Watercolor
      'https://images.unsplash.com/photo-1543857770-7245f4c2280d?auto=format&fit=crop&q=80&w=1000', // Abstract paint
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=1000', // Color palette
      'https://images.unsplash.com/photo-1529156340245-c419c80d5402?auto=format&fit=crop&q=80&w=1000', // Drawing
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80&w=1000', // Sketch
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=1000', // Architecture
      'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1000', // Lens
      'https://images.unsplash.com/photo-1520423465871-0866049020b7?auto=format&fit=crop&q=80&w=1000', // Design
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000', // Pop Art
    ]
  },

  async fetchArticles(interests) {
    if (!interests || interests.length === 0) return [];

    const CACHE_KEY = `wiki_cache_${interests.sort().join('_')}`;
    const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour
    const cached = localStorage.getItem(CACHE_KEY);
    
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log("Using cached Wikipedia data");
                return data;
            }
        } catch (e) {
            console.error("Cache parse error", e);
        }
    }

    let allArticles = [];

    const fetchPromises = interests.map(async (interest) => {
       try {
           const queryPool = (this.SEARCH_QUERIES[interest] || interest).split('|');
           // Pick 2 random queries to diversify content
           const selectedQueries = queryPool.sort(() => 0.5 - Math.random()).slice(0, 2);
           
           for(const query of selectedQueries) {
               // 1. Search for titles
               const searchUrl = `${this.WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*&srlimit=2`;
               const searchRes = await fetch(searchUrl);
               const searchData = await searchRes.json();
               
               if(!searchData.query || !searchData.query.search) continue;
               
               const titles = searchData.query.search.map(r => r.title);
               if(titles.length === 0) continue;

               // 2. Fetch full content and image for these titles
               const titlesParam = titles.map(encodeURIComponent).join('|');
               const contentUrl = `${this.WIKI_API}?action=query&prop=extracts|pageimages&exintro=false&explaintext=true&titles=${titlesParam}&format=json&origin=*&pithumbsize=1000`;
               const contentRes = await fetch(contentUrl);
               const contentData = await contentRes.json();
               
               if(!contentData.query || !contentData.query.pages) continue;
               
               const pages = Object.values(contentData.query.pages);
               
               pages.forEach(page => {
                   if(page.missing === "") return;
                   
                   const title = page.title;
                   const extract = page.extract || "";
                   if(extract.length < 200) return; // Skip very short pages or disambiguation
                   
                   // Clean up text: remove reference sections
                   const cleanText = extract.split(/==\s*참고 ?문헌\s*==|==\s*각주\s*==|==\s*같이 보기\s*==|==\s*외부 링크\s*==/)[0].trim();
                   
                   // Split into paragraphs. Filter out very short lines (often headers)
                   let paragraphs = cleanText.split(/\n\s*\n/).map(p => p.replace(/\n/g, ' ').trim()).filter(p => p.length > 50);
                   
                   // If article is just one giant block, split by periods for better readability
                   if(paragraphs.length === 1 && paragraphs[0].length > 400) {
                      paragraphs = paragraphs[0].split(/(?<=\.)\s+/);
                   }

                   const summary = paragraphs[0] || title;
                   
                   const extractFirstSentence = (text) => {
                       if(!text) return "";
                       const match = text.match(/[^.!?]+[.!?]/);
                       return match ? match[0] : text.substring(0, 50) + "...";
                   };
                   
                   const keyPoints = [];
                   if(paragraphs[0]) keyPoints.push(extractFirstSentence(paragraphs[0]));
                   if(paragraphs[1]) keyPoints.push(extractFirstSentence(paragraphs[1]));
                   if(paragraphs[Math.floor(paragraphs.length/2)]) keyPoints.push(extractFirstSentence(paragraphs[Math.floor(paragraphs.length/2)]));

                   // Image handling
                   let image = page.thumbnail ? page.thumbnail.source : null;
                   if(!image) {
                       const fallbacks = this.FALLBACK_IMAGES[interest] || this.FALLBACK_IMAGES['IT/기술'];
                       image = fallbacks[this.getHash(title) % fallbacks.length];
                   }
                   
                   allArticles.push({
                        id: `wiki-${page.pageid}`,
                        title: title,
                        summary: summary,
                        content: paragraphs, 
                        image: image,
                        category: this.mapCategoryToEnglish(interest),
                        date: new Date().toLocaleDateString(),
                        originalDate: new Date().toISOString(),
                        originalLink: `https://ko.wikipedia.org/wiki/${encodeURIComponent(title)}`,
                        keyPoints: keyPoints.filter(k => k) 
                   });
               });
           }
       } catch (error) {
           console.warn(`Failed to fetch Wiki for ${interest}`, error);
       }
    });

    await Promise.all(fetchPromises);

    // Shuffle articles mixing categories naturally
    const shuffledArticles = allArticles.sort(() => 0.5 - Math.random());

    if (shuffledArticles.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: shuffledArticles
        }));
    }

    return shuffledArticles;
  },

  getHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
  },

  mapCategoryToEnglish(korean) {
    const map = {
      'IT/기술': 'Technology',
      '건강': 'Health',
      '과학': 'Science',
      '경제': 'Economy',
      '경제/금융': 'Economy',
      '예술': 'Art'
    };
    return map[korean] || 'General';
  }
};
