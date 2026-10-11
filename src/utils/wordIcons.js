import { createElement } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, Apple, Armchair, ArrowDown, ArrowUp,
  Baby, Banana, Bath, Bed, Bike, Bird, Book, BookOpen, Brain, Briefcase, Bug,
  Building2, Bus, Cake, Calculator, Calendar, Camera, Candy, Car, Cat, Check,
  Circle,
  Clock, Cloud, CloudLightning, CloudRain, CloudSnow, Coffee, Coins, Compass,
  CreditCard, Croissant, Crown, Dog, DoorClosed, DoorOpen, Droplets, Ear, Egg,
  Eye, FileText, Fish, FlaskConical, Flower, Footprints, Frown, Gift,
  GlassWater, Glasses, Globe, GraduationCap, Grape, Hand, Hash, Heart,
  HeartHandshake, HelpCircle, Home, Hotel, IceCream, Info, Key, Lamp, Laptop,
  Leaf, Lightbulb, Lock, Luggage, Mail, Map, MapPin, Meh, MessageCircle,
  Milestone, Monitor, Mountain, Music, Notebook, Package, Palette, Pencil,
  PersonStanding, Phone, Pizza, Plane, Play, Plug, Plus, Rabbit, Receipt,
  Refrigerator, Repeat, Rocket, Salad, Sandwich, School, Scissors, Search, Shield,
  Ship, Shirt, ShoppingBag, ShoppingCart, Smartphone, Smile, Snowflake, Sofa,
  Soup, Sparkles, Sprout, Star, Store, Sun, Swords, Table2, Tag, Target, Tent,
  Thermometer, ThumbsUp, Ticket, Timer, Train, TreeDeciduous, TreePine, Trophy,
  Truck, Tv, Umbrella, User, UserCircle, Users, UtensilsCrossed, Wallet,
  WashingMachine, Watch, Waves, Wifi, Wind, X, Zap
} from 'lucide-react';

const iconNode = (nodes) => function CustomLineIcon({ size = 24, className = '', strokeWidth = 2 }) {
  return createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className,
      'aria-hidden': 'true'
    },
    nodes.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))
  );
};

const sketchNode = (nodes) => function SketchLineIcon({ size = 24, className = '', strokeWidth = 2 }) {
  return createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 64 64',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className,
      'aria-hidden': 'true'
    },
    nodes.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))
  );
};

const DuckLine = iconNode([
  ['path', { d: 'M5 16c1-4 4-6 8-5 2 .4 4 2 5 4' }],
  ['path', { d: 'M8 11c.4-3 2-5 4-5 1.8 0 3 1.1 3 2.8 0 1.2-.6 2.2-1.5 2.8' }],
  ['path', { d: 'M15 9h3l2 1-2 1h-3' }],
  ['path', { d: 'M11 9h.01' }],
  ['path', { d: 'M5 17h14' }],
  ['path', { d: 'M9 18c2 1 5 1 7 0' }]
]);

const ChickenLine = iconNode([
  ['path', { d: 'M7 16c0-4 3-7 7-7 2 0 4 1 5 3' }],
  ['path', { d: 'M9 9c0-2 1.4-3 3-3s3 1.2 3 3' }],
  ['path', { d: 'M11 6c0-1 1-2 1-2s1 1 1 2' }],
  ['path', { d: 'M14 8l3-2' }],
  ['path', { d: 'M17 12h3l-2 1.5' }],
  ['path', { d: 'M12 10h.01' }],
  ['path', { d: 'M10 19v2' }],
  ['path', { d: 'M15 19v2' }],
  ['path', { d: 'M6 19h13' }]
]);

const ButterLine = iconNode([
  ['path', { d: 'M5 10h11l3 3v5H8l-3-3z' }],
  ['path', { d: 'M5 10 8 7h11v6' }],
  ['path', { d: 'M8 18v-5l-3-3' }]
]);

const CheeseLine = iconNode([
  ['path', { d: 'M4 16 19 7v10H4z' }],
  ['circle', { cx: 12, cy: 13, r: 1 }],
  ['circle', { cx: 16, cy: 15, r: 1 }],
  ['circle', { cx: 16, cy: 10, r: 1 }]
]);

const PotatoLine = iconNode([
  ['path', { d: 'M8 5c5-2 10 1 11 6 1 4-2 8-7 8-5 1-8-2-8-6 0-3 1-6 4-8z' }],
  ['path', { d: 'M9 10h.01' }],
  ['path', { d: 'M13 8h.01' }],
  ['path', { d: 'M15 14h.01' }],
  ['path', { d: 'M10 15h.01' }]
]);

const SaltLine = iconNode([
  ['path', { d: 'M9 7h6l1 13H8z' }],
  ['path', { d: 'M10 4h4l1 3H9z' }],
  ['path', { d: 'M11 11h.01' }],
  ['path', { d: 'M13 11h.01' }],
  ['path', { d: 'M12 14h.01' }]
]);

const TomatoLine = iconNode([
  ['circle', { cx: 12, cy: 13, r: 6 }],
  ['path', { d: 'm12 7 1-3' }],
  ['path', { d: 'm12 7-3-2' }],
  ['path', { d: 'm12 7 3-2' }],
  ['path', { d: 'm12 7-1 3' }]
]);

const CatSketch = sketchNode([
  ['path', { d: 'M18 28 14 14l12 8 6-1 6 1 12-8-4 14' }],
  ['path', { d: 'M17 30c0 13 8 22 15 22s15-9 15-22c0-7-6-12-15-12s-15 5-15 12z' }],
  ['path', { d: 'M26 34h.01' }], ['path', { d: 'M38 34h.01' }],
  ['path', { d: 'M32 38v4' }], ['path', { d: 'M27 44c3 3 7 3 10 0' }],
  ['path', { d: 'M10 37h13' }], ['path', { d: 'M10 44h13' }],
  ['path', { d: 'M41 37h13' }], ['path', { d: 'M41 44h13' }]
]);

const DogSketch = sketchNode([
  ['path', { d: 'M20 24c2-8 22-8 24 0 8 2 10 11 4 16-1 12-9 18-16 18S17 52 16 40c-6-5-4-14 4-16z' }],
  ['path', { d: 'M20 25 12 15c-2 10 1 18 7 22' }],
  ['path', { d: 'M44 25 52 15c2 10-1 18-7 22' }],
  ['path', { d: 'M26 34h.01' }], ['path', { d: 'M38 34h.01' }],
  ['path', { d: 'M32 39v5' }], ['path', { d: 'M27 46c3 4 7 4 10 0' }]
]);

const BirdSketch = sketchNode([
  ['path', { d: 'M15 47c6-18 18-31 31-24 10 6 5 23-6 27-8 3-17 1-25-3z' }],
  ['path', { d: 'M39 27c5 2 9 2 14-1l-6 7' }],
  ['path', { d: 'M34 29h.01' }], ['path', { d: 'M23 45c3-8 9-14 18-18' }],
  ['path', { d: 'M30 51v7' }], ['path', { d: 'M38 50v8' }],
  ['path', { d: 'M25 58h8' }], ['path', { d: 'M35 58h8' }]
]);

const FishSketch = sketchNode([
  ['path', { d: 'M10 33c10-14 28-16 42 0-14 16-32 14-42 0z' }],
  ['path', { d: 'M11 33 4 22v22z' }], ['path', { d: 'M26 21c6 6 6 18 0 24' }],
  ['circle', { cx: 43, cy: 31, r: 1.8 }], ['path', { d: 'M18 25c4 3 7 4 12 4' }],
  ['path', { d: 'M18 41c4-3 7-4 12-4' }]
]);

const RabbitSketch = sketchNode([
  ['path', { d: 'M23 24C17 8 20 4 27 19' }],
  ['path', { d: 'M36 20C39 5 46 7 41 24' }],
  ['path', { d: 'M17 35c0-10 7-17 16-17s16 7 16 17-7 18-16 18-16-8-16-18z' }],
  ['path', { d: 'M27 35h.01' }], ['path', { d: 'M39 35h.01' }],
  ['path', { d: 'M33 39v4' }], ['path', { d: 'M28 46c3 3 7 3 10 0' }]
]);

const DuckSketch = sketchNode([
  ['path', { d: 'M14 43c5-17 21-24 35-10 8 8-2 20-18 20-7 0-13-3-17-10z' }],
  ['path', { d: 'M23 29c1-12 7-18 15-15 6 2 7 10 2 16' }],
  ['path', { d: 'M39 22h12l8 4-8 4H39' }], ['path', { d: 'M31 22h.01' }],
  ['path', { d: 'M12 51c10 5 27 6 42 0' }]
]);

const ChickenSketch = sketchNode([
  ['path', { d: 'M16 42c0-15 10-25 23-21 9 3 14 12 11 24-3 10-12 15-22 12-8-2-12-8-12-15z' }],
  ['path', { d: 'M28 21c0-7 8-10 14-6 3 2 5 6 3 10' }],
  ['path', { d: 'M33 15c-1-5 4-8 4-8s5 4 3 9' }],
  ['path', { d: 'M44 23h11l-7 6' }], ['path', { d: 'M35 23h.01' }],
  ['path', { d: 'M26 57v5' }], ['path', { d: 'M39 56v6' }],
  ['path', { d: 'M20 62h12' }], ['path', { d: 'M34 62h13' }]
]);

const PetSketch = sketchNode([
  ['path', { d: 'M19 40c0-10 6-18 15-18s15 8 15 18-6 17-15 17-15-7-15-17z' }],
  ['path', { d: 'M23 27 16 16c-1 8 1 14 6 18' }],
  ['path', { d: 'M45 27 52 16c1 8-1 14-6 18' }],
  ['path', { d: 'M28 37h.01' }], ['path', { d: 'M40 37h.01' }],
  ['path', { d: 'M34 42v4' }], ['path', { d: 'M26 18c4-8 12-8 16 0' }]
]);

const SpiderSketch = sketchNode([
  ['circle', { cx: 32, cy: 34, r: 10 }], ['circle', { cx: 32, cy: 21, r: 7 }],
  ['path', { d: 'M23 31 9 23' }], ['path', { d: 'M22 36 8 36' }],
  ['path', { d: 'M24 41 11 51' }], ['path', { d: 'M41 31 55 23' }],
  ['path', { d: 'M42 36 56 36' }], ['path', { d: 'M40 41 53 51' }],
  ['path', { d: 'M29 21h.01' }], ['path', { d: 'M35 21h.01' }]
]);

const HorseSketch = sketchNode([
  ['path', { d: 'M12 43c3-15 15-26 32-23l8 9-6 8h-9' }],
  ['path', { d: 'M22 24 17 10l14 9' }], ['path', { d: 'M31 21c-5 5-7 12-7 22' }],
  ['path', { d: 'M19 43v13' }], ['path', { d: 'M40 43v13' }],
  ['path', { d: 'M46 22c4-6 9-7 13-5' }], ['path', { d: 'M43 28h.01' }]
]);

const MonkeySketch = sketchNode([
  ['circle', { cx: 32, cy: 30, r: 16 }], ['circle', { cx: 14, cy: 31, r: 7 }],
  ['circle', { cx: 50, cy: 31, r: 7 }], ['path', { d: 'M23 31c2-6 16-6 18 0' }],
  ['path', { d: 'M25 39c4 5 10 5 14 0' }], ['path', { d: 'M25 25h.01' }],
  ['path', { d: 'M39 25h.01' }], ['path', { d: 'M19 46c-8 7 3 15 13 8 10 7 21-1 13-8' }]
]);

const SnakeSketch = sketchNode([
  ['path', { d: 'M10 48c9 8 27 7 31-2 3-7-12-8-7-17 4-8 21-2 20-13-1-10-18-12-29-2' }],
  ['path', { d: 'M26 14c-11 5-15 16-7 23 7 7 18 1 19 10' }],
  ['path', { d: 'M50 17h.01' }], ['path', { d: 'm55 17 6-3' }], ['path', { d: 'm55 17 6 3' }]
]);

const TigerSketch = sketchNode([
  ['path', { d: 'M16 32c0-13 8-22 16-22s16 9 16 22-8 22-16 22-16-9-16-22z' }],
  ['path', { d: 'M20 18 12 9' }], ['path', { d: 'M44 18 52 9' }],
  ['path', { d: 'm27 11 3 10' }], ['path', { d: 'm37 11-3 10' }],
  ['path', { d: 'M21 29h9' }], ['path', { d: 'M34 29h9' }],
  ['path', { d: 'M26 34h.01' }], ['path', { d: 'M38 34h.01' }],
  ['path', { d: 'M27 43c4 4 6 4 10 0' }]
]);

const ElephantSketch = sketchNode([
  ['path', { d: 'M13 37c-3-18 9-29 25-25 12 3 18 14 12 27' }],
  ['path', { d: 'M20 27C8 20 7 35 17 43' }], ['path', { d: 'M44 27c13-7 14 8 4 16' }],
  ['path', { d: 'M37 32c10 11 2 24-9 20' }], ['path', { d: 'M26 31h.01' }],
  ['path', { d: 'M17 45v11' }], ['path', { d: 'M44 45v11' }]
]);

const BearSketch = sketchNode([
  ['circle', { cx: 32, cy: 34, r: 17 }], ['circle', { cx: 17, cy: 18, r: 7 }],
  ['circle', { cx: 47, cy: 18, r: 7 }], ['path', { d: 'M26 32h.01' }],
  ['path', { d: 'M38 32h.01' }], ['path', { d: 'M32 37h.01' }],
  ['path', { d: 'M27 43c4 4 6 4 10 0' }]
]);

const FrogSketch = sketchNode([
  ['path', { d: 'M12 41c0-16 9-27 20-27s20 11 20 27v6H12z' }],
  ['circle', { cx: 22, cy: 18, r: 7 }], ['circle', { cx: 42, cy: 18, r: 7 }],
  ['path', { d: 'M21 18h.01' }], ['path', { d: 'M43 18h.01' }],
  ['path', { d: 'M24 42c5 4 11 4 16 0' }], ['path', { d: 'M10 51h14' }], ['path', { d: 'M40 51h14' }]
]);

const CowSketch = sketchNode([
  ['path', { d: 'M14 29c0-12 8-20 18-20s18 8 18 20v11c0 12-8 19-18 19s-18-7-18-19z' }],
  ['path', { d: 'M18 21 8 10' }], ['path', { d: 'M46 21 56 10' }],
  ['path', { d: 'M24 32h.01' }], ['path', { d: 'M40 32h.01' }],
  ['path', { d: 'M24 45c6 4 10 4 16 0' }], ['path', { d: 'M29 48h.01' }], ['path', { d: 'M35 48h.01' }]
]);

const SheepSketch = sketchNode([
  ['circle', { cx: 21, cy: 30, r: 9 }], ['circle', { cx: 32, cy: 25, r: 10 }],
  ['circle', { cx: 43, cy: 32, r: 9 }], ['circle', { cx: 31, cy: 40, r: 13 }],
  ['path', { d: 'M45 31h.01' }], ['path', { d: 'M17 51v9' }], ['path', { d: 'M42 51v9' }]
]);

const MouseSketch = sketchNode([
  ['path', { d: 'M10 40c5-16 23-23 38-9 9 9 0 23-17 23-10 0-18-5-21-14z' }],
  ['circle', { cx: 25, cy: 25, r: 8 }], ['path', { d: 'M45 35h.01' }],
  ['path', { d: 'M10 41C3 41 2 48 7 52' }], ['path', { d: 'M49 40h11' }], ['path', { d: 'M49 45h9' }]
]);

const LionSketch = sketchNode([
  ['circle', { cx: 32, cy: 32, r: 13 }],
  ['path', { d: 'M32 5 27 18' }], ['path', { d: 'm45 10-7 11' }], ['path', { d: 'm56 26-12 4' }],
  ['path', { d: 'm52 47-12-8' }], ['path', { d: 'm32 59 0-14' }], ['path', { d: 'm12 47 12-8' }],
  ['path', { d: 'M8 26l12 4' }], ['path', { d: 'm19 10 7 11' }],
  ['path', { d: 'M26 33h.01' }], ['path', { d: 'M38 33h.01' }], ['path', { d: 'M27 41c4 4 6 4 10 0' }]
]);

const PandaSketch = sketchNode([
  ['circle', { cx: 32, cy: 34, r: 18 }], ['circle', { cx: 16, cy: 18, r: 8 }],
  ['circle', { cx: 48, cy: 18, r: 8 }], ['ellipse', { cx: 25, cy: 32, rx: 6, ry: 8 }],
  ['ellipse', { cx: 39, cy: 32, rx: 6, ry: 8 }],
  ['path', { d: 'M25 32h.01' }], ['path', { d: 'M39 32h.01' }], ['path', { d: 'M32 40h.01' }],
  ['path', { d: 'M27 47c4 3 6 3 10 0' }]
]);

const ICONS = {
  Activity, AlertCircle, AlertTriangle, Apple, Armchair, ArrowDown, ArrowUp,
  Baby, Banana, Bath, Bed, Bike, Bird, Book, BookOpen, Brain, Briefcase, Bug,
  Building2, Bus, Cake, Calculator, Calendar, Camera, Candy, Car, Cat, Check,
  Circle,
  Clock, Cloud, CloudLightning, CloudRain, CloudSnow, Coffee, Coins, Compass,
  CreditCard, Croissant, Crown, Dog, DoorClosed, DoorOpen, Droplets, Ear, Egg,
  Eye, FileText, Fish, FlaskConical, Flower, Footprints, Frown, Gift,
  GlassWater, Glasses, Globe, GraduationCap, Grape, Hand, Hash, Heart,
  HeartHandshake, HelpCircle, Home, Hotel, IceCream, Info, Key, Lamp, Laptop,
  Leaf, Lightbulb, Lock, Luggage, Mail, Map, MapPin, Meh, MessageCircle,
  Milestone, Monitor, Mountain, Music, Notebook, Package, Palette, Pencil,
  PersonStanding, Phone, Pizza, Plane, Play, Plug, Plus, Rabbit, Receipt,
  Refrigerator, Repeat, Rocket, Salad, Sandwich, School, Scissors, Search, Shield,
  Ship, Shirt, ShoppingBag, ShoppingCart, Smartphone, Smile, Snowflake, Sofa,
  Soup, Sparkles, Sprout, Star, Store, Sun, Swords, Table2, Tag, Target, Tent,
  Thermometer, ThumbsUp, Ticket, Timer, Train, TreeDeciduous, TreePine, Trophy,
  Truck, Tv, Umbrella, User, UserCircle, Users, UtensilsCrossed, Wallet,
  WashingMachine, Watch, Waves, Wifi, Wind, X, Zap,
  DuckLine, ChickenLine,
  ButterLine, CheeseLine, PotatoLine, SaltLine, TomatoLine,
  CatSketch, DogSketch, BirdSketch, FishSketch, RabbitSketch, DuckSketch,
  ChickenSketch, PetSketch, SpiderSketch,
  HorseLine: HorseSketch,
  MonkeyLine: MonkeySketch,
  SnakeLine: SnakeSketch,
  TigerLine: TigerSketch,
  ElephantLine: ElephantSketch,
  BearLine: BearSketch,
  FrogLine: FrogSketch,
  CowLine: CowSketch,
  SheepLine: SheepSketch,
  MouseLine: MouseSketch,
  LionLine: LionSketch,
  PandaLine: PandaSketch
};

const TOPIC_ACCENT = {
  animals: '#10b981',
  colors: '#ec4899',
  numbers: '#6366f1',
  family: '#3b82f6',
  food: '#f59e0b',
  body: '#ef4444',
  clothes: '#a855f7',
  house: '#0ea5e9',
  furniture: '#14b8a6',
  daily_items: '#f97316',
  school: '#8b5cf6',
  subjects: '#06b6d4',
  time: '#d946ef',
  transport: '#0284c7',
  places: '#059669',
  directions: '#7c3aed',
  weather: '#0891b2',
  nature: '#16a34a',
  seasons: '#ea580c',
  daily_starters: '#2563eb',
  family_friends: '#0f766e',
  food_cafe: '#d97706',
  body_health: '#dc2626',
  home_room: '#0891b2',
  school_library: '#7c3aed',
  city_travel: '#0284c7',
  nature_weather: '#16a34a',
  sports_hobbies: '#ea580c',
  feelings_descriptions: '#db2777',
  shopping_work: '#be123c',
  tech_media: '#4f46e5',
  exam_expressions: '#64748b',
  full_review: '#059669',
};

export function getIllustrationIcon(name) {
  return ICONS[name] || HelpCircle;
}

export function hasIllustrationIcon(name) {
  return Boolean(ICONS[name]);
}

export const illustrationIconNames = Object.freeze(Object.keys(ICONS));

export function getTopicAccent(topic) {
  return TOPIC_ACCENT[topic] || 'var(--primary)';
}
