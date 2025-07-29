import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShapeType, LineType, Template } from '../constants/type';
import { generateUUID } from '@/utils/generateUUID';
import { loginTemplate } from '@/constants/Template';


export interface SavedProject {
  id: string;
  name: string;
  shapes: ShapeType[];
  date: string;
}

export interface CanvasContextType {
  shapes: ShapeType[];
  lines: LineType[];
  setShapes: Dispatch<SetStateAction<ShapeType[]>>;
  setLines: Dispatch<SetStateAction<LineType[]>>;
  trash: ShapeType[];
  deleteToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  clearTrash: () => void;
  selectedShapeId: string | null;
  setSelectedShapeId: Dispatch<SetStateAction<string | null>>;
  undo: () => void;
  redo: () => void;
  saveToHistory: (newShapes: ShapeType[]) => void;
  deleteShapeById: (id: string) => void;
  addShape: (shape: ShapeType) => void;
  addLine: (line: LineType) => void;
  addImageFromGallery: () => Promise<void>;
  updateShape: (id: string, updates: Partial<ShapeType>) => void;
  saveToStorage: () => Promise<void>;
  deleteShape: (id: string) => void;
  loadTemplate: (template: Template) => void;
  saveToMirror: () => void;
  mirrorDesign: ShapeType[];
  savedDesign: ShapeType[];
  setSavedDesign: Dispatch<SetStateAction<ShapeType[]>>;
  templates: Template[];
  popupShapeId: string | null;
  setPopupShapeId: (id: string | null) => void;
  updateShapeStyle: (id: string, newStyle: Partial<ShapeType['style']>) => void;
  addTextShape: () => void;
  selectShape: (id: string | null) => void;
  reorderShape: (shapeId: string, direction: 'up' | 'down') => void;
  toggleShapeVisibility: (shapeId: string) => void;
  toggleShapeLock: (shapeId: string) => void;
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  previewLine: { x1: number; y1: number; x2: number; y2: number } | null;
  setPreviewLine: (line: { x1: number; y1: number; x2: number; y2: number } | null) => void;
  savedProjects: SavedProject[];
  saveProject: (name?: string) => void;
  currentProjectId: string | null;
  setCurrentProjectId: Dispatch<SetStateAction<string | null>>;
  connectStartShapeId: string | null;
  setConnectStartShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedShapeIds: string[];
setSelectedShapeIds: Dispatch<SetStateAction<string[]>>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const initialTemplates: Template[] = [
  { // Template 1: E-commerce Flow - V3
     id: 'template1',
    name: 'E-commerce Flow - V3',
    shapes: [
      { id: 'start', type: 'oval', position: { x: 150, y: 20 }, style: { width: 140, height: 60, backgroundColor: '#FFDDC1', borderRadius: 30 }, text: 'Enter website' },
      { id: 'product_list', type: 'rectangle', position: { x: 150, y: 130 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Go to product list page' },
      { id: 'review_recommended', type: 'rectangle', position: { x: 150, y: 240 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Review recommended item' },
      { id: 'search_items', type: 'rectangle', position: { x: 20, y: 350 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Search for items' },
      { id: 'use_menu', type: 'rectangle', position: { x: 280, y: 350 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Use the menu and navigate' },
      { id: 'identify_purchase', type: 'rectangle', position: { x: 150, y: 460 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Identify item for purchase' },
      { id: 'add_to_cart', type: 'rectangle', position: { x: 150, y: 570 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Add item to shopping cart' },
      { id: 'more_items', type: 'diamond', position: { x: 150, y: 680 }, style: { width: 140, height: 140, backgroundColor: '#D8BFD8' }, text: 'More items?' },
      { id: 'checkout', type: 'rectangle', position: { x: 150, y: 850 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Checkout process' },
      { id: 'login_signup', type: 'rectangle', position: { x: 150, y: 960 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Login/signup page' },
      { id: 'review_order', type: 'rectangle', position: { x: 150, y: 1070 }, style: { width: 140, height: 60, backgroundColor: '#A7C7E7' }, text: 'Review order confirmation' },
      { id: 'exit', type: 'oval', position: { x: 150, y: 1180 }, style: { width: 140, height: 60, backgroundColor: '#FFDDC1', borderRadius: 30 }, text: 'Exit website' },
    ],
    lines: [
        { id: 'l1', startShapeId: 'start', endShapeId: 'product_list', label: '' },
        { id: 'l2', startShapeId: 'product_list', endShapeId: 'review_recommended', label: '' },
        { id: 'l3', startShapeId: 'review_recommended', endShapeId: 'identify_purchase', label: '' },
        { id: 'l4', startShapeId: 'search_items', endShapeId: 'identify_purchase', label: '' },
        { id: 'l5', startShapeId: 'use_menu', endShapeId: 'identify_purchase', label: '' },
        { id: 'l6', startShapeId: 'identify_purchase', endShapeId: 'add_to_cart', label: '' },
        { id: 'l7', startShapeId: 'add_to_cart', endShapeId: 'more_items', label: '' },
        { id: 'l8', startShapeId: 'more_items', endShapeId: 'checkout', label: 'No' },
        { id: 'l9', startShapeId: 'more_items', endShapeId: 'product_list', label: 'Yes' },
        { id: 'l10', startShapeId: 'checkout', endShapeId: 'login_signup', label: '' },
        { id: 'l11', startShapeId: 'login_signup', endShapeId: 'review_order', label: '' },
        { id: 'l12', startShapeId: 'review_order', endShapeId: 'exit', label: '' },
    ],
  },
  { // Template 2: Problem-Solving Flowchart - V3
    id: 'template2',
    name: 'Problem-Solving Flowchart - V3',
    shapes: [
      { id: 't2_start', type: 'oval', position: { x: 350, y: 20 }, style: { width: 120, height: 50, backgroundColor: '#F08080', borderRadius: 25 }, text: 'Start' },
      { id: 't2_see_button', type: 'diamond', position: { x: 300, y: 120 }, style: { width: 220, height: 220, backgroundColor: '#7FFFD4' }, text: 'Can you see a button or a menu item related to what you want to do?' },
      { id: 't2_click_it', type: 'rectangle', position: { x: 350, y: 400 }, style: { width: 120, height: 50, backgroundColor: '#87CEEB' }, text: 'Click it' },
      { id: 't2_did_it_work', type: 'diamond', position: { x: 325, y: 500 }, style: { width: 170, height: 170, backgroundColor: '#7FFFD4' }, text: 'Did it work?' },
      { id: 't2_you_are_done', type: 'oval', position: { x: 335, y: 720 }, style: { width: 150, height: 60, backgroundColor: '#F08080', borderRadius: 30 }, text: 'You are done' },
      { id: 't2_tried_random', type: 'diamond', position: { x: 600, y: 120 }, style: { width: 180, height: 180, backgroundColor: '#7FFFD4' }, text: 'Did you try one at random?' },
      { id: 't2_google_it', type: 'rectangle', position: { x: 610, y: 350 }, style: { width: 160, height: 80, backgroundColor: '#87CEEB' }, text: 'Google name of the program plus a few words related to what you want to do' },
      { id: 't2_half_hour', type: 'diamond', position: { x: 50, y: 500 }, style: { width: 200, height: 200, backgroundColor: '#7FFFD4' }, text: 'Have you been trying this for over half an hour?' },
      { id: 't2_ask_someone', type: 'oval', position: { x: 60, y: 750 }, style: { width: 180, height: 70, backgroundColor: '#F08080', borderRadius: 35 }, text: 'Ask someone for help or give up' },
    ],
    lines: [
      { id: 't2_l1', startShapeId: 't2_start', endShapeId: 't2_see_button', label: '' },
      { id: 't2_l2', startShapeId: 't2_see_button', endShapeId: 't2_click_it', label: 'Yes' },
      { id: 't2_l3', startShapeId: 't2_click_it', endShapeId: 't2_did_it_work', label: '' },
      { id: 't2_l4', startShapeId: 't2_did_it_work', endShapeId: 't2_you_are_done', label: 'Yes' },
      { id: 't2_l5', startShapeId: 't2_see_button', endShapeId: 't2_tried_random', label: 'No' },
      { id: 't2_l6', startShapeId: 't2_tried_random', endShapeId: 't2_google_it', label: 'No' },
      { id: 't2_l7', startShapeId: 't2_tried_random', endShapeId: 't2_click_it', label: 'Yes' },
      { id: 't2_l8', startShapeId: 't2_did_it_work', endShapeId: 't2_half_hour', label: 'No' },
      { id: 't2_l9', startShapeId: 't2_half_hour', endShapeId: 't2_ask_someone', label: 'Yes' },
      { id: 't2_l10', startShapeId: 't2_half_hour', endShapeId: 't2_google_it', label: 'No' },
    ],
  },
  { // Template 3: Simple 3-Step Process
    id: 'template3',
    name: 'Simple 3-Step Process',
    shapes: [
      { id: 't3_step1', type: 'rectangle', position: { x: 150, y: 50 }, style: { width: 150, height: 70, backgroundColor: '#C1E1C1' }, text: 'Step 1' },
      { id: 't3_step2', type: 'rectangle', position: { x: 150, y: 200 }, style: { width: 150, height: 70, backgroundColor: '#C1E1C1' }, text: 'Step 2' },
      { id: 't3_step3', type: 'rectangle', position: { x: 150, y: 350 }, style: { width: 150, height: 70, backgroundColor: '#C1E1C1' }, text: 'Step 3' },
    ],
    lines: [
      { id: 't3_l1', startShapeId: 't3_step1', endShapeId: 't3_step2', label: '' },
      { id: 't3_l2', startShapeId: 't3_step2', endShapeId: 't3_step3', label: '' },
    ],
  },
  { // Template 4: Basic Decision
    
    id: 'template4',
    name: 'Basic Decision',
    shapes: [
      { id: 't4_start', type: 'oval', position: { x: 150, y: 50 }, style: { width: 150, height: 70, backgroundColor: '#FADADD', borderRadius: 35 }, text: 'Start' },
      { id: 't4_decision', type: 'diamond', position: { x: 125, y: 200 }, style: { width: 200, height: 200, backgroundColor: '#BDE4F4' }, text: 'Decision Point' },
      { id: 't4_option_a', type: 'rectangle', position: { x: 20, y: 450 }, style: { width: 150, height: 70, backgroundColor: '#C1E1C1' }, text: 'Option A' },
      { id: 't4_option_b', type: 'rectangle', position: { x: 280, y: 450 }, style: { width: 150, height: 70, backgroundColor: '#C1E1C1' }, text: 'Option B' },
    ],
    lines: [
      { id: 't4_l1', startShapeId: 't4_start', endShapeId: 't4_decision', label: '' },
      { id: 't4_l2', startShapeId: 't4_decision', endShapeId: 't4_option_a', label: 'Yes' },
      { id: 't4_l3', startShapeId: 't4_decision', endShapeId: 't4_option_b', label: 'No' },
    ],
  },
  //Template 5: Landing Page 
 {
  id: 'landingPageTemplate',
  name: 'Landing Page Preview',
  shapes: [
    {
      id: 'hero',
      type: 'rectangle',
      position: { x: 50, y: 40 },
      style: {
        width: 300,
        height: 100,
        backgroundColor: '#E3F2FD',
      },
      text: 'Hero Section',
    },
    {
      id: 'features',
      type: 'rectangle',
      position: { x: 50, y: 160 },
      style: {
        width: 300,
        height: 120,
        backgroundColor: '#FFF3E0',
      },
      text: 'Features Section',
    },
    {
      id: 'cta',
      type: 'rectangle',
      position: { x: 50, y: 290 },
      style: {
        width: 300,
        height: 80,
        backgroundColor: '#C8E6C9',
      },
      text: 'Call To Action',
    },
    {
      id: 'footer',
      type: 'rectangle',
      position: { x: 50, y: 380 },
      style: {
        width: 300,
        height: 60,
        backgroundColor: '#CFD8DC',
      },
      text: 'Footer',
    },
    {
      id: 'imagePreview',
      type: 'image',
      position: { x: 120, y: 180 },
      style: {
        width: 100,
        height: 80,
      },
      uri: 'https://via.placeholder.com/100x80.png?text=Preview', // 🖼️ preview image
    },
  ],
  lines: [
    { id: 'l1', startShapeId: 'hero', endShapeId: 'features', label: '' },
    { id: 'l2', startShapeId: 'features', endShapeId: 'cta', label: '' },
    { id: 'l3', startShapeId: 'cta', endShapeId: 'footer', label: '' },
  ],
},
//Template 6: Login UI
{
  id: 'template_login_ui',
  name: 'Login Page - Shadowed UI',
  shapes: [
    // Title
    {
      id: 'title',
      type: 'text',
      position: { x: 120, y: 50 },
      style: { fontSize: 28, color: '#222' },
      text: 'Welcome Back',
    },
    // Email field background
    {
      id: 'emailField',
      type: 'rectangle',
      position: { x: 50, y: 120 },
      style: {
        width: 280,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    // Email icon placeholder
    {
      id: 'emailIcon',
      type: 'text',
      position: { x: 60, y: 135 },
      style: { fontSize: 16, color: '#999' },
      text: '📧',
    },
    // Email placeholder text
    {
      id: 'emailText',
      type: 'text',
      position: { x: 90, y: 135 },
      style: { fontSize: 16, color: '#999' },
      text: 'Email address',
    },

    // Password field background
    {
      id: 'passwordField',
      type: 'rectangle',
      position: { x: 50, y: 190 },
      style: {
        width: 280,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    // Password icon placeholder
    {
      id: 'passwordIcon',
      type: 'text',
      position: { x: 60, y: 205 },
      style: { fontSize: 16, color: '#999' },
      text: '🔒',
    },
    // Password placeholder text
    {
      id: 'passwordText',
      type: 'text',
      position: { x: 90, y: 205 },
      style: { fontSize: 16, color: '#999' },
      text: 'Password',
    },

    // Forgot password
    {
      id: 'forgotText',
      type: 'text',
      position: { x: 180, y: 250 },
      style: { fontSize: 14, color: '#3498db' },
      text: 'Forgot password?',
    },

    // Login button
    {
      id: 'loginBtn',
      type: 'rectangle',
      position: { x: 50, y: 290 },
      style: {
        width: 280,
        height: 50,
        backgroundColor: '#3498db',
        borderRadius: 8,
      },
      text: 'Log In',
    },

    // Sign up prompt
    {
      id: 'signupPrompt',
      type: 'text',
      position: { x: 90, y: 360 },
      style: { fontSize: 14, color: '#666' },
      text: "Don't have an account? Sign up",
    },
  ],
  lines: [
    { id: 'l1', startShapeId: 'title', endShapeId: 'emailField', label: '' },
    { id: 'l2', startShapeId: 'emailField', endShapeId: 'passwordField', label: '' },
    { id: 'l3', startShapeId: 'passwordField', endShapeId: 'loginBtn', label: '' },
  ],
},
{
  id: 'loginPageTemplate',
  name: 'Login Page Preview',
  shapes: [
    {
      id: 'logo',
      type: 'oval',
      position: { x: 140, y: 40 },
      style: {
        width: 120,
        height: 120,
        backgroundColor: '#1976D2',
        borderRadius: 60,
      },
      text: 'Logo',
    },
    {
      id: 'title',
      type: 'text',
      position: { x: 90, y: 180 },
      style: {
        width: 240,
        height: 40,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#333',
      },
      text: 'Welcome Back!',
    },
    {
      id: 'emailInput',
      type: 'rectangle',
      position: { x: 40, y: 250 },
      style: {
        width: 300,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 12,
      },
      text: 'Email Address',
    },
    {
      id: 'passwordInput',
      type: 'rectangle',
      position: { x: 40, y: 310 },
      style: {
        width: 300,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 12,
      },
      text: 'Password',
    },
    {
      id: 'loginBtn',
      type: 'rectangle',
      position: { x: 40, y: 380 },
      style: {
        width: 300,
        height: 50,
        backgroundColor: '#1976D2',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      },
      text: 'Log In',
    },
    {
      id: 'forgotText',
      type: 'text',
      position: { x: 200, y: 440 },
      style: {
        width: 140,
        height: 30,
        fontSize: 14,
        textAlign: 'right',
        color: '#1976D2',
        backgroundColor: 'transparent',
      },
      text: 'Forgot Password?',
    },
    {
      id: 'sideImage',
      type: 'image',
      position: { x: 360, y: 250 },
      style: {
        width: 60,
        height: 120,
        borderRadius: 12,
      },
      uri: 'https://via.placeholder.com/60x120.png?text=User',
    },
  ],
  lines: [
    { id: 'line1', startShapeId: 'logo', endShapeId: 'title', label: '' },
    { id: 'line2', startShapeId: 'title', endShapeId: 'emailInput', label: '' },
    { id: 'line3', startShapeId: 'emailInput', endShapeId: 'passwordInput', label: '' },
    { id: 'line4', startShapeId: 'passwordInput', endShapeId: 'loginBtn', label: '' },
    { id: 'line5', startShapeId: 'loginBtn', endShapeId: 'forgotText', label: '' },
  ],
},
//food app template
{
  id: 'foodAppHomeTemplate',
  name: 'Food App Landing Screen',
  shapes: [
    // Logo Icon
    {
      id: 'logo',
      type: 'circle',
      position: { x: 170, y: 40 },
      style: {
        width: 60,
        height: 60,
        backgroundColor: '#FF7043',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: '🍴',
    },

    // Welcome Title
    {
      id: 'title',
      type: 'text',
      position: { x: 100, y: 120 },
      style: {
        width: 200,
        height: 40,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
      text: 'Delicious Meals\nDelivered Fast',
    },

    // Search Bar
    {
      id: 'searchBar',
      type: 'rectangle',
      position: { x: 40, y: 190 },
      style: {
        width: 300,
        height: 48,
        backgroundColor: '#F1F3F4',
        borderRadius: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingLeft: 16,
        fontSize: 16,
        color: '#333',
      },
      text: 'Search for meals...',
    },

    // Featured Dish Card
    {
      id: 'featuredCard',
      type: 'rectangle',
      position: { x: 40, y: 260 },
      style: {
        width: 300,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      text: '',
    },

    // Dish Image (masked into rectangle)
    {
      id: 'dishImage',
      type: 'image',
      position: { x: 40, y: 260 },
      style: {
        width: 300,
        height: 160,
        borderRadius: 16,
      },
      uri: 'https://via.placeholder.com/300x160.png?text=Pasta+Bowl',
      maskedShape: 'rectangle',
    },

    ...['Pizza', 'Burger', 'Drinks', 'Dessert'].map((cat, i) =>
  ({
    id: `catBtn${i}`,
    type: 'rectangle',
    position: { x: 40 + i * 80, y: 440 },
    style: {
      width: 70,
      height: 70,
      backgroundColor: '#FFF3E0',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    text: cat,
  } as ShapeType) // ✅ assertion fixes the type
),

    // Order Now Button
    {
      id: 'orderBtn',
      type: 'rectangle',
      position: { x: 40, y: 540 },
      style: {
        width: 300,
        height: 52,
        backgroundColor: '#FF5722',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: 'Order Now',
    },
  ],

  lines: [
    { id: 'line1', startShapeId: 'logo', endShapeId: 'title', label: '' },
    { id: 'line2', startShapeId: 'title', endShapeId: 'searchBar', label: '' },
    { id: 'line3', startShapeId: 'searchBar', endShapeId: 'dishImage', label: '' },
    { id: 'line4', startShapeId: 'dishImage', endShapeId: 'catBtn0', label: '' },
    { id: 'line5', startShapeId: 'catBtn0', endShapeId: 'orderBtn', label: '' },
  ],
}
];


export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectStartShapeId, setConnectStartShapeId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [lines, setLines] = useState<LineType[]>([]);
  const [trash, setTrash] = useState<ShapeType[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [history, setHistory] = useState<ShapeType[][]>([]);
  const [redoStack, setRedoStack] = useState<ShapeType[][]>([]);
  const [mirrorDesign, setMirrorDesign] = useState<ShapeType[]>([]);
  const [savedDesign, setSavedDesign] = useState<ShapeType[]>([]);
  const [popupShapeId, setPopupShapeId] = useState<string | null>(null);
  const [templates] = useState<Template[]>(initialTemplates);
  const [scale, setScale] = useState(1);
  const [previewLine, setPreviewLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);


  const addShape = (shape: ShapeType) => {
    saveToHistory([...shapes, shape]);
  };

  const addLine = (line: LineType) => {
    setLines(prev => [...prev, line]);
  };

  const saveToHistory = (newShapes: ShapeType[]) => {
    setHistory(prev => [...prev, shapes]);
    setRedoStack([]);
    setShapes(newShapes);
  };

  const deleteShape = (id: string) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
  };

  const updateShape = (id: string, newProps: Partial<ShapeType>) => {
    setShapes(currentShapes =>
      currentShapes.map(s => {
        if (s.id === id) {
          // Create a new object for the updated shape
          const updatedShape = { ...s };

          // Merge position if it exists
          if (newProps.position) {
            updatedShape.position = { ...s.position, ...newProps.position };
          }
          
          // Merge style if it exists
          if (newProps.style) {
            updatedShape.style = { ...s.style, ...newProps.style };
          }

          // Merge other properties like text, uri, etc.
          if (newProps.text !== undefined) updatedShape.text = newProps.text;
          if (newProps.uri !== undefined) updatedShape.uri = newProps.uri;
          if (newProps.isLocked !== undefined) updatedShape.isLocked = newProps.isLocked;
          if (newProps.backgroundImage !== undefined) updatedShape.backgroundImage = newProps.backgroundImage;
          if (newProps.backgroundImageMode !== undefined) updatedShape.backgroundImageMode = newProps.backgroundImageMode;
          
          return updatedShape;
        }
        return s;
      })
    );
  };

  const updateShapeStyle = (id: string, newStyle: Partial<ShapeType['style']>) => {
    setShapes(prev =>
      prev.map(shape =>
        shape.id === id
          ? { ...shape, style: { ...shape.style, ...newStyle } }
          : shape
      )
    );
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setRedoStack(r => [...r, shapes]);
    setShapes(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(r => r.slice(0, -1));
    setHistory(prev => [...prev, shapes]);
    setShapes(next);
  };

  const deleteShapeById = (id: string) => {
    setShapes(prev => {
      const shapeToDelete = prev.find(s => s.id === id);
      if (shapeToDelete) {
        setTrash(deleted => [...deleted, shapeToDelete]);
      }
      return prev.filter(s => s.id !== id);
    });
  };

  const deleteToTrash = (id: string) => {
    setShapes(prev => {
      const shape = prev.find(s => s.id === id);
      if (shape) {
        setTrash(old => [...old, shape]);
      }
      return prev.filter(s => s.id !== id);
    });
  };

  const restoreFromTrash = (id: string) => {
    setTrash(prev => {
      const shapeToRestore = prev.find(s => s.id === id);
      if (shapeToRestore) {
        setShapes(currentShapes => [...currentShapes, shapeToRestore]);
      }
      return prev.filter(s => s.id !== id);
    });
  };

  const clearTrash = () => {
    setTrash([]);
  };

 const addImageFromGallery = async () => {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) return Alert.alert('Permission Denied');

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!res.canceled && res.assets.length) {
    const img = res.assets[0];
    const newShape: ShapeType = {
      id: generateUUID(),
      type: 'image',
      uri: img.uri,
      position: { x: 100, y: 100 },
      style: { width: 150, height: 150 },
    };

    setShapes(prev => {
      const updated = [...prev, newShape];
      saveToHistory(updated);
      return updated;
    });
  }
};

  const addTextShape = () => {
    const newShape: ShapeType = {
      id: generateUUID(),
      type: 'text',
      position: { x: 100, y: 100 },
      style: {
        width: 150,
        height: 60,
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderWidth: 1,
      },
      text: 'Edit Me',
      fontSize: 18,
      fontColor: '#000000',
    };
    saveToHistory([...shapes, newShape]);
  };

  const selectShape = (id: string | null) => {
    setSelectedShapeId(id);
  };

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem('shapes', JSON.stringify(shapes));
    } catch (error) {
      console.error('Error saving shapes:', error);
    }
  };

  const saveToMirror = () => {
    setMirrorDesign([...shapes]);
  };

  const loadTemplate = (template: Template) => {
    const clonedShapes = template.shapes.map((shape:any) => ({
      ...shape,
      id: generateUUID(),
    }));
    const idMap = template.shapes.reduce((acc:any, shape:any, i:any) => {
      (acc as any)[shape.id] = clonedShapes[i].id;
      return acc;
    }, {} as Record<string, string>);

   const clonedLines = template.lines.map((line: LineType) => ({
  ...line,
  id: generateUUID(),
  startShapeId: idMap[line.startShapeId],
  endShapeId: idMap[line.endShapeId],
}));


    setShapes(clonedShapes);
    setLines(clonedLines);
    saveToHistory(clonedShapes);
  };

  const reorderShape = (shapeId: string, direction: 'up' | 'down') => {
    setShapes(prev => {
      const index = prev.findIndex(s => s.id === shapeId);
      if (index === -1) return prev;

      const newShapes = [...prev];
      const [shape] = newShapes.splice(index, 1);

      if (direction === 'up' && index < newShapes.length) {
        newShapes.splice(index + 1, 0, shape);
      } else if (direction === 'down' && index > 0) {
        newShapes.splice(index - 1, 0, shape);
      } else {
        newShapes.splice(index, 0, shape); // Return to original position if move is invalid
      }

      return newShapes;
    });
  };

  const toggleShapeVisibility = (shapeId: string) => {
    setShapes(prev =>
      prev.map(s =>
        s.id === shapeId ? { ...s, isVisible: !(s.isVisible ?? true) } : s
      )
    );
  };

  const toggleShapeLock = (shapeId: string) => {
    setShapes(prev =>
      prev.map(s => (s.id === shapeId ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // Zoom in, max 200%
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Zoom out, min 50%
  };

  const saveProject = (name?: string) => {
    const id = generateUUID();
    const projectName = name || `Project ${savedProjects.length + 1}`;
    const date = new Date().toISOString();
    const newProject: SavedProject = {
      id,
      name: projectName,
      shapes: [...shapes],
      date,
    };
    setSavedProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(id);
  };

  return (
    <CanvasContext.Provider
      value={{
        shapes,
        lines,
        setShapes,
        setLines,
        trash,
        deleteToTrash,
        restoreFromTrash,
        clearTrash,
        selectedShapeId,
        setSelectedShapeId,
        undo,
        redo,
        saveToHistory,
        deleteShapeById,
        addShape,
        addLine,
        addImageFromGallery,
        updateShape,
        saveToStorage,
        deleteShape,
        loadTemplate,
        saveToMirror,
        mirrorDesign,
        savedDesign,
        setSavedDesign,
        templates,
        popupShapeId,
        setPopupShapeId,
        updateShapeStyle,
        addTextShape,
        selectShape,
        reorderShape,
        toggleShapeVisibility,
        toggleShapeLock,
        scale,
        zoomIn,
        zoomOut,
        previewLine,
        setPreviewLine,
        savedProjects,
        saveProject,
        currentProjectId,
        setCurrentProjectId,
        connectStartShapeId,
        setConnectStartShapeId,
        selectedShapeIds,
         setSelectedShapeIds,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}; 