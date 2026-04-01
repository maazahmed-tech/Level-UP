export interface MenuItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isBestChoice: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  logoEmoji: string;
  introduction: string;
  tips: string;
  menuItems: MenuItem[];
}

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "McDonald's",
    slug: "mcdonalds",
    logoEmoji: "\uD83C\uDF54",
    introduction:
      "McDonald's is the world's largest fast-food chain, serving millions daily. While it's known for indulgent burgers and fries, there are surprisingly solid macro-friendly options if you know what to order. Focus on grilled chicken and simpler burger builds to keep calories in check.",
    tips: "Opt for grilled chicken wraps or burgers without mayo and cheese to save 150-200 calories. Skip the large fries and grab a side salad instead. Breakfast egg McMuffins are one of the best macro-friendly fast food breakfasts available.",
    menuItems: [
      { name: "Big Mac", calories: 550, protein: 25, carbs: 45, fat: 30, isBestChoice: false },
      { name: "Quarter Pounder with Cheese", calories: 520, protein: 30, carbs: 42, fat: 26, isBestChoice: false },
      { name: "McChicken", calories: 400, protein: 14, carbs: 40, fat: 21, isBestChoice: false },
      { name: "Grilled Chicken Wrap", calories: 360, protein: 28, carbs: 34, fat: 12, isBestChoice: true },
      { name: "Egg McMuffin", calories: 300, protein: 17, carbs: 26, fat: 13, isBestChoice: true },
      { name: "6pc Chicken McNuggets", calories: 250, protein: 15, carbs: 15, fat: 15, isBestChoice: false },
      { name: "Filet-O-Fish", calories: 390, protein: 16, carbs: 39, fat: 19, isBestChoice: false },
      { name: "Medium Fries", calories: 320, protein: 4, carbs: 43, fat: 15, isBestChoice: false },
      { name: "Side Salad (no dressing)", calories: 15, protein: 1, carbs: 2, fat: 0, isBestChoice: true },
      { name: "Double Cheeseburger", calories: 450, protein: 25, carbs: 34, fat: 24, isBestChoice: false },
    ],
  },
  {
    id: 2,
    name: "Chipotle",
    slug: "chipotle",
    logoEmoji: "\uD83C\uDF2F",
    introduction:
      "Chipotle is a fitness favourite thanks to its customisable bowls and burritos. You can build a high-protein, macro-balanced meal easily if you choose wisely. The key is watching portion sizes on rice, cheese, and sour cream.",
    tips: "Order a burrito bowl instead of a burrito to save 300 calories from the tortilla. Double protein (chicken or steak) is the best upgrade for gains. Go easy on cheese, sour cream, and guac if cutting -- each adds 100-250 calories.",
    menuItems: [
      { name: "Chicken Burrito Bowl (rice, beans, salsa, lettuce)", calories: 510, protein: 42, carbs: 52, fat: 11, isBestChoice: true },
      { name: "Steak Burrito Bowl (rice, beans, salsa, lettuce)", calories: 540, protein: 40, carbs: 52, fat: 14, isBestChoice: true },
      { name: "Chicken Burrito (full wrap)", calories: 815, protein: 45, carbs: 82, fat: 26, isBestChoice: false },
      { name: "Carnitas Bowl (rice, beans, salsa)", calories: 570, protein: 34, carbs: 52, fat: 19, isBestChoice: false },
      { name: "Sofritas Bowl (rice, beans, salsa)", calories: 480, protein: 18, carbs: 58, fat: 16, isBestChoice: false },
      { name: "Chips & Guacamole", calories: 770, protein: 11, carbs: 68, fat: 48, isBestChoice: false },
      { name: "Side of Guacamole", calories: 230, protein: 3, carbs: 8, fat: 22, isBestChoice: false },
      { name: "Chicken Salad Bowl (no dressing)", calories: 360, protein: 40, carbs: 18, fat: 12, isBestChoice: true },
      { name: "Queso Blanco (side)", calories: 120, protein: 5, carbs: 4, fat: 9, isBestChoice: false },
    ],
  },
  {
    id: 3,
    name: "Five Guys",
    slug: "five-guys",
    logoEmoji: "\uD83C\uDF1D",
    introduction:
      "Five Guys is famous for its fresh, customisable burgers and generous fries. While portions tend to be calorie-dense, there are ways to keep your meal reasonable. The lettuce wrap option is a game-changer for those watching carbs.",
    tips: "Order your burger in a lettuce wrap to cut 260 calories from the bun. Skip the fries or share a Little Fries -- a regular portion is over 500 calories. Load up on free toppings like mushrooms, peppers, and onions for extra volume without extra calories.",
    menuItems: [
      { name: "Little Hamburger", calories: 480, protein: 26, carbs: 39, fat: 26, isBestChoice: false },
      { name: "Little Cheeseburger", calories: 550, protein: 28, carbs: 40, fat: 32, isBestChoice: false },
      { name: "Hamburger (two patties)", calories: 700, protein: 39, carbs: 39, fat: 43, isBestChoice: false },
      { name: "Bacon Cheeseburger", calories: 920, protein: 51, carbs: 40, fat: 62, isBestChoice: false },
      { name: "Lettuce Wrap Burger (single patty)", calories: 220, protein: 20, carbs: 1, fat: 15, isBestChoice: true },
      { name: "Little Fries", calories: 528, protein: 7, carbs: 64, fat: 26, isBestChoice: false },
      { name: "Regular Fries", calories: 953, protein: 12, carbs: 115, fat: 47, isBestChoice: false },
      { name: "Hot Dog", calories: 545, protein: 18, carbs: 40, fat: 35, isBestChoice: false },
      { name: "Veggie Sandwich", calories: 440, protein: 16, carbs: 60, fat: 15, isBestChoice: false },
      { name: "BLT (lettuce wrap)", calories: 280, protein: 14, carbs: 2, fat: 22, isBestChoice: true },
    ],
  },
  {
    id: 4,
    name: "KFC",
    slug: "kfc",
    logoEmoji: "\uD83C\uDF57",
    introduction:
      "KFC's fried chicken is iconic, but the batter and oil add significant calories. However, their grilled options and lighter sides can make a decent macro-friendly meal. Knowing the difference between Original Recipe and Extra Crispy is crucial.",
    tips: "Choose grilled chicken pieces over Original Recipe or Extra Crispy to save up to 50% of the calories. Pair with corn on the cob or green beans instead of mashed potatoes with gravy. A grilled drumstick has only 80 calories and 11g protein -- stack a few for a high-protein meal.",
    menuItems: [
      { name: "Original Recipe Chicken Breast", calories: 390, protein: 39, carbs: 11, fat: 21, isBestChoice: false },
      { name: "Grilled Chicken Breast", calories: 210, protein: 38, carbs: 0, fat: 7, isBestChoice: true },
      { name: "Grilled Chicken Drumstick", calories: 80, protein: 11, carbs: 0, fat: 4, isBestChoice: true },
      { name: "Extra Crispy Chicken Breast", calories: 530, protein: 35, carbs: 18, fat: 35, isBestChoice: false },
      { name: "Chicken Popcorn (Large)", calories: 560, protein: 26, carbs: 38, fat: 33, isBestChoice: false },
      { name: "Famous Bowl", calories: 710, protein: 26, carbs: 82, fat: 31, isBestChoice: false },
      { name: "Corn on the Cob", calories: 70, protein: 2, carbs: 13, fat: 2, isBestChoice: true },
      { name: "Coleslaw", calories: 170, protein: 1, carbs: 14, fat: 12, isBestChoice: false },
      { name: "Mashed Potatoes & Gravy", calories: 130, protein: 2, carbs: 18, fat: 5, isBestChoice: false },
    ],
  },
  {
    id: 5,
    name: "Subway",
    slug: "subway",
    logoEmoji: "\uD83E\uDD6A",
    introduction:
      "Subway markets itself as a healthier fast-food option, and it can be -- if you order smart. The ability to customise every ingredient makes it easy to build a macro-friendly sub. Stick with lean proteins and load up on veggies.",
    tips: "Choose a 6-inch sub on wheat bread with double protein for the best macro balance. Skip the mayo, oil, and cheese to save over 200 calories. The Rotisserie Chicken and Turkey Breast subs are your best friends on a cut.",
    menuItems: [
      { name: "6\" Turkey Breast Sub", calories: 280, protein: 18, carbs: 46, fat: 3, isBestChoice: true },
      { name: "6\" Rotisserie Chicken Sub", calories: 350, protein: 29, carbs: 45, fat: 6, isBestChoice: true },
      { name: "6\" Chicken Teriyaki Sub", calories: 360, protein: 26, carbs: 52, fat: 5, isBestChoice: false },
      { name: "6\" Italian BMT Sub", calories: 410, protein: 20, carbs: 46, fat: 16, isBestChoice: false },
      { name: "6\" Steak & Cheese Sub", calories: 380, protein: 26, carbs: 46, fat: 10, isBestChoice: false },
      { name: "6\" Veggie Delite Sub", calories: 230, protein: 8, carbs: 44, fat: 2, isBestChoice: false },
      { name: "Protein Bowl (Chicken, no dressing)", calories: 210, protein: 26, carbs: 10, fat: 5, isBestChoice: true },
      { name: "Cookie (Chocolate Chip)", calories: 220, protein: 2, carbs: 30, fat: 10, isBestChoice: false },
      { name: "Footlong Meatball Marinara", calories: 900, protein: 40, carbs: 100, fat: 36, isBestChoice: false },
    ],
  },
  {
    id: 6,
    name: "Nando's",
    slug: "nandos",
    logoEmoji: "\uD83D\uDD25",
    introduction:
      "Nando's flame-grilled peri-peri chicken is one of the most macro-friendly restaurant options out there. Most chicken options are high in protein and relatively low in fat. It's a gym-goer's dream if you pair it with the right sides.",
    tips: "Butterfly chicken breast is the ultimate high-protein option at around 36g protein for only 300 calories. Swap chips for chargrilled veg or spicy rice for a lower-calorie side. Avoid creamy dips like perinaise -- peri-peri sauce is nearly calorie-free.",
    menuItems: [
      { name: "1/4 Chicken Breast", calories: 180, protein: 28, carbs: 0, fat: 7, isBestChoice: true },
      { name: "1/2 Chicken", calories: 440, protein: 56, carbs: 0, fat: 22, isBestChoice: false },
      { name: "Butterfly Chicken Breast", calories: 300, protein: 36, carbs: 2, fat: 16, isBestChoice: true },
      { name: "Chicken Thighs (3 pcs)", calories: 380, protein: 38, carbs: 0, fat: 24, isBestChoice: false },
      { name: "Peri-Peri Chicken Wrap", calories: 470, protein: 32, carbs: 42, fat: 18, isBestChoice: false },
      { name: "Chicken Burger", calories: 440, protein: 30, carbs: 38, fat: 18, isBestChoice: false },
      { name: "Spicy Rice", calories: 250, protein: 5, carbs: 42, fat: 7, isBestChoice: false },
      { name: "Chargrilled Veg", calories: 80, protein: 3, carbs: 10, fat: 3, isBestChoice: true },
      { name: "Peri Chips (Regular)", calories: 340, protein: 5, carbs: 48, fat: 14, isBestChoice: false },
      { name: "Corn on the Cob", calories: 120, protein: 3, carbs: 22, fat: 2, isBestChoice: false },
    ],
  },
  {
    id: 7,
    name: "Domino's",
    slug: "dominos",
    logoEmoji: "\uD83C\uDF55",
    introduction:
      "Domino's pizza can fit your macros if you're strategic about your order. Thin crust options and lighter toppings can keep calories reasonable. The key is portion control -- two slices of a smart choice beats half a stuffed crust.",
    tips: "Order thin crust instead of classic or stuffed crust to save 60-100 calories per slice. Stick to chicken, ham, or veggie toppings instead of pepperoni and sausage. Two slices of a medium thin-crust chicken pizza can easily fit a cutting diet.",
    menuItems: [
      { name: "Medium Thin Crust Margherita (1 slice)", calories: 140, protein: 6, carbs: 15, fat: 6, isBestChoice: true },
      { name: "Medium Classic Crust Pepperoni (1 slice)", calories: 220, protein: 10, carbs: 26, fat: 9, isBestChoice: false },
      { name: "Medium Thin Crust Chicken (1 slice)", calories: 155, protein: 9, carbs: 15, fat: 7, isBestChoice: true },
      { name: "Medium Stuffed Crust Pepperoni (1 slice)", calories: 310, protein: 14, carbs: 32, fat: 14, isBestChoice: false },
      { name: "Chicken Strippers (4 pcs)", calories: 260, protein: 20, carbs: 18, fat: 12, isBestChoice: false },
      { name: "Garlic Bread (4 pcs)", calories: 340, protein: 8, carbs: 42, fat: 16, isBestChoice: false },
      { name: "Chicken Wings (6 pcs)", calories: 420, protein: 30, carbs: 12, fat: 28, isBestChoice: false },
      { name: "Side Salad", calories: 25, protein: 1, carbs: 4, fat: 0, isBestChoice: true },
      { name: "Potato Wedges", calories: 350, protein: 5, carbs: 48, fat: 15, isBestChoice: false },
    ],
  },
  {
    id: 8,
    name: "Burger King",
    slug: "burger-king",
    logoEmoji: "\uD83D\uDC51",
    introduction:
      "Burger King's flame-grilled burgers are a step up from deep-fried alternatives, but the sauces and extras add up fast. With smart ordering, you can enjoy a satisfying meal without destroying your calorie budget. Their grilled chicken options are the hidden gems.",
    tips: "The Whopper Jr. is a solid choice at under 350 calories with decent protein. Ask for no mayo on any burger to instantly cut 100+ calories. Their grilled chicken sandwich is one of the best macro-friendly options in any burger chain.",
    menuItems: [
      { name: "Whopper", calories: 660, protein: 28, carbs: 49, fat: 40, isBestChoice: false },
      { name: "Whopper Jr.", calories: 340, protein: 15, carbs: 28, fat: 19, isBestChoice: false },
      { name: "Grilled Chicken Sandwich", calories: 360, protein: 30, carbs: 34, fat: 12, isBestChoice: true },
      { name: "Hamburger", calories: 250, protein: 14, carbs: 26, fat: 10, isBestChoice: true },
      { name: "Bacon King", calories: 1150, protein: 61, carbs: 49, fat: 79, isBestChoice: false },
      { name: "Chicken Nuggets (8 pcs)", calories: 380, protein: 16, carbs: 24, fat: 24, isBestChoice: false },
      { name: "Veggie Burger", calories: 390, protein: 14, carbs: 48, fat: 16, isBestChoice: false },
      { name: "Medium Onion Rings", calories: 410, protein: 5, carbs: 51, fat: 20, isBestChoice: false },
      { name: "Garden Side Salad", calories: 60, protein: 3, carbs: 4, fat: 3, isBestChoice: true },
      { name: "King Jr. Meal (Hamburger + Apple Slices)", calories: 310, protein: 15, carbs: 38, fat: 11, isBestChoice: false },
    ],
  },
  {
    id: 9,
    name: "Pizza Hut",
    slug: "pizza-hut",
    logoEmoji: "\uD83C\uDF55",
    introduction:
      "Pizza Hut offers a range of crusts and toppings, and your choice dramatically impacts the calorie count. Thin'N Crispy is your best bet for keeping macros in line. Their pasta dishes are calorie bombs that are best avoided.",
    tips: "Thin'N Crispy crust saves 50-80 calories per slice vs Pan or Stuffed Crust. Choose chicken, ham, or veggie toppings over sausage and extra cheese. Avoid the pasta dishes -- the Meaty Marinara pasta has over 1,000 calories per serving.",
    menuItems: [
      { name: "Medium Thin'N Crispy Margherita (1 slice)", calories: 150, protein: 7, carbs: 16, fat: 6, isBestChoice: true },
      { name: "Medium Thin'N Crispy Chicken (1 slice)", calories: 160, protein: 10, carbs: 16, fat: 7, isBestChoice: true },
      { name: "Medium Pan Supreme (1 slice)", calories: 280, protein: 12, carbs: 28, fat: 14, isBestChoice: false },
      { name: "Medium Stuffed Crust Pepperoni (1 slice)", calories: 340, protein: 15, carbs: 32, fat: 16, isBestChoice: false },
      { name: "Chicken Wings (6 pcs)", calories: 390, protein: 28, carbs: 10, fat: 26, isBestChoice: false },
      { name: "Garlic Bread (2 pcs)", calories: 260, protein: 6, carbs: 28, fat: 14, isBestChoice: false },
      { name: "Meaty Marinara Pasta", calories: 1050, protein: 42, carbs: 110, fat: 46, isBestChoice: false },
      { name: "Caesar Salad", calories: 180, protein: 8, carbs: 10, fat: 12, isBestChoice: false },
      { name: "Side Garden Salad", calories: 35, protein: 2, carbs: 5, fat: 1, isBestChoice: true },
    ],
  },
  {
    id: 10,
    name: "Greggs",
    slug: "greggs",
    logoEmoji: "\uD83E\uDD50",
    introduction:
      "Greggs is a UK high-street staple known for sausage rolls and pasties. While most items are pastry-heavy and calorie-dense, there are some surprisingly decent options. Their salads and lower-calorie sandwiches are worth knowing about.",
    tips: "The Chicken & Bacon Baguette and Tandoori Chicken Wrap are solid macro choices. Avoid the sausage rolls and pasties -- they're mostly fat and refined carbs. The Mexican Chicken Soup is one of the lowest-calorie, highest-protein lunch options at only 170 calories.",
    menuItems: [
      { name: "Classic Sausage Roll", calories: 320, protein: 7, carbs: 24, fat: 22, isBestChoice: false },
      { name: "Vegan Sausage Roll", calories: 310, protein: 8, carbs: 28, fat: 18, isBestChoice: false },
      { name: "Steak Bake", calories: 410, protein: 13, carbs: 34, fat: 25, isBestChoice: false },
      { name: "Chicken & Bacon Baguette", calories: 380, protein: 25, carbs: 42, fat: 12, isBestChoice: true },
      { name: "Tandoori Chicken Wrap", calories: 340, protein: 22, carbs: 38, fat: 10, isBestChoice: true },
      { name: "Mexican Chicken Soup", calories: 170, protein: 14, carbs: 18, fat: 4, isBestChoice: true },
      { name: "Ham & Cheese Toastie", calories: 350, protein: 18, carbs: 30, fat: 17, isBestChoice: false },
      { name: "Cheese & Onion Bake", calories: 430, protein: 10, carbs: 36, fat: 28, isBestChoice: false },
      { name: "Chocolate Doughnut", calories: 250, protein: 3, carbs: 32, fat: 12, isBestChoice: false },
    ],
  },
  {
    id: 11,
    name: "Costa Coffee",
    slug: "costa-coffee",
    logoEmoji: "\u2615",
    introduction:
      "Costa Coffee is the UK's biggest coffee chain, and their drinks range from virtually zero-calorie Americanos to 500+ calorie Frostinos. The food options are hit-or-miss for macros. Knowing the calorie content of your usual order can be eye-opening.",
    tips: "Swap your latte for an Americano with a splash of milk to save 150+ calories. Ask for sugar-free syrup to shave off 60-80 calories per flavoured drink. The Protein Box or porridge are your best food options for balanced macros.",
    menuItems: [
      { name: "Americano (Medium)", calories: 10, protein: 1, carbs: 1, fat: 0, isBestChoice: true },
      { name: "Flat White", calories: 120, protein: 7, carbs: 10, fat: 6, isBestChoice: false },
      { name: "Latte (Medium, semi-skimmed)", calories: 160, protein: 8, carbs: 14, fat: 7, isBestChoice: false },
      { name: "Caramel Latte (Medium)", calories: 260, protein: 8, carbs: 36, fat: 8, isBestChoice: false },
      { name: "Iced Mocha Frostino (Medium)", calories: 460, protein: 8, carbs: 62, fat: 18, isBestChoice: false },
      { name: "Porridge", calories: 230, protein: 9, carbs: 34, fat: 6, isBestChoice: true },
      { name: "Egg & Bacon Panini", calories: 370, protein: 22, carbs: 32, fat: 16, isBestChoice: false },
      { name: "Protein Box", calories: 290, protein: 24, carbs: 20, fat: 12, isBestChoice: true },
      { name: "Chocolate Brownie", calories: 380, protein: 5, carbs: 42, fat: 22, isBestChoice: false },
    ],
  },
  {
    id: 12,
    name: "Starbucks",
    slug: "starbucks",
    logoEmoji: "\uD83D\uDFE2",
    introduction:
      "Starbucks drinks can range from 5 calories to over 500 depending on your order. The secret is customisation -- every modification counts. Their food options have improved with more protein-forward choices in recent years.",
    tips: "Order any drink with almond or oat milk and sugar-free syrup to cut 100+ calories. A Grande Iced Coffee with a splash of milk is only 20 calories -- add a protein snack for a perfect combo. Avoid the Frappuccinos -- even a 'light' version can pack 200+ calories.",
    menuItems: [
      { name: "Grande Americano", calories: 15, protein: 1, carbs: 2, fat: 0, isBestChoice: true },
      { name: "Grande Latte (semi-skimmed)", calories: 190, protein: 12, carbs: 18, fat: 7, isBestChoice: false },
      { name: "Grande Iced Coffee (black)", calories: 5, protein: 0, carbs: 1, fat: 0, isBestChoice: true },
      { name: "Grande Caramel Frappuccino", calories: 420, protein: 5, carbs: 66, fat: 15, isBestChoice: false },
      { name: "Grande Matcha Latte (oat milk)", calories: 240, protein: 5, carbs: 40, fat: 6, isBestChoice: false },
      { name: "Protein Box (Eggs & Cheese)", calories: 300, protein: 22, carbs: 24, fat: 14, isBestChoice: true },
      { name: "Chicken & Bacon Panini", calories: 380, protein: 26, carbs: 34, fat: 14, isBestChoice: false },
      { name: "Blueberry Muffin", calories: 380, protein: 5, carbs: 54, fat: 16, isBestChoice: false },
      { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, isBestChoice: true },
    ],
  },
];
