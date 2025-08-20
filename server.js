const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for design analysis
app.post('/api/analyze', upload.single('design'), async (req, res) => {
    try {
        let imageData;
        
        if (req.file) {
            // Handle file upload
            imageData = {
                type: 'file',
                path: `/uploads/${req.file.filename}`,
                originalName: req.file.originalname
            };
        } else if (req.body.url) {
            // Handle URL submission
            imageData = {
                type: 'url',
                url: req.body.url
            };
        } else {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Generate critique based on design principles
        const critique = await generateCritique(imageData);
        
        res.json({
            success: true,
            imageData,
            critique
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze design',
            message: error.message 
        });
    }
});

// Generate critique function
async function generateCritique(imageData) {
    // This is where you would integrate with Claude API or other AI services
    // For now, returning structured critique based on design principles
    
    const critics = [
        {
            name: 'Steve Jobs',
            avatar: 'SJ',
            title: 'Simplicity & Focus',
            focus: 'Analyzing the soul and essence of your design...',
            points: generateJobsCritique()
        },
        {
            name: 'John Maeda',
            avatar: 'JM',
            title: 'Simplicity Laws',
            focus: 'Applying the Laws of Simplicity to your design...',
            points: generateMaedaCritique()
        },
        {
            name: 'Airbnb Design',
            avatar: 'AB',
            title: 'Human Connection',
            focus: 'Evaluating trust, belonging, and human elements...',
            points: generateAirbnbCritique()
        },
        {
            name: 'Instagram Aesthetic',
            avatar: 'IG',
            title: 'Visual Impact',
            focus: 'Checking the thumb-stopping power and mobile experience...',
            points: generateInstagramCritique()
        },
        {
            name: 'Jony Ive',
            avatar: 'JI',
            title: 'Craft & Detail',
            focus: 'Examining the craftsmanship and material honesty...',
            points: generateIveCritique()
        }
    ];
    
    return critics;
}

function generateJobsCritique() {
    const critiques = [
        'The hierarchy needs refinement. Users should instantly know where to focus.',
        'Consider removing 30% of the elements. What\'s truly essential?',
        'The core message gets lost in the details. What\'s the ONE thing to remember?',
        'Typography lacks confidence. Be bold in your declarations.',
        'This design should feel inevitable, not constructed.'
    ];
    return selectRandom(critiques, 3, 5);
}

function generateMaedaCritique() {
    const critiques = [
        'REDUCE: Several elements serve the same purpose. Combine or eliminate.',
        'ORGANIZE: Related elements need stronger visual grouping.',
        'TIME: Loading and transitions should feel instantaneous.',
        'LEARN: Complex interactions need simplification for intuitive use.',
        'EMOTION: Add surprise and delight through subtraction, not addition.',
        'DIFFERENCES: Make important elements more distinct.',
        'CONTEXT: Consider the environment where this will be used.'
    ];
    return selectRandom(critiques, 3, 5);
}

function generateAirbnbCritique() {
    const critiques = [
        'The human element is missing. Add warmth through storytelling.',
        'Trust signals need strengthening through consistent design patterns.',
        'Create more breathing room. Comfort comes from generous spacing.',
        'The tone feels corporate. Make it conversational and welcoming.',
        'Consider how this makes people feel they belong.',
        'Add elements that create emotional safety and familiarity.'
    ];
    return selectRandom(critiques, 3, 5);
}

function generateInstagramCritique() {
    const critiques = [
        'The visual hook needs more impact for scroll-stopping power.',
        'Content should be the hero. Reduce UI competition.',
        'Optimize for thumb reach and one-handed mobile use.',
        'Add micro-interactions that create moments of delight.',
        'Performance feels heavy. Prioritize speed and smoothness.',
        'Consider how this looks at a glance, not just in detail.'
    ];
    return selectRandom(critiques, 3, 5);
}

function generateIveCritique() {
    const critiques = [
        'Edges and transitions need more refinement and craft.',
        'The material metaphor isn\'t consistent. What is this made of?',
        'Remove decorative elements that don\'t serve function.',
        'The grid system fights against natural content flow.',
        'Negative space is underutilized. It\'s not empty, it\'s potential.',
        'Details should whisper quality, not shout for attention.'
    ];
    return selectRandom(critiques, 3, 5);
}

function selectRandom(array, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Start server
app.listen(PORT, () => {
    console.log(`Design Critic Agent running at http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
});