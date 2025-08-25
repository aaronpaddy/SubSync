#!/usr/bin/env node

/**
 * SubTrackr Chrome Extension Build Script
 * 
 * This script prepares the Chrome extension for production by:
 * - Updating API endpoints
 * - Creating production builds
 * - Validating the extension
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    development: {
        apiBase: 'http://localhost:5000',
        environment: 'development'
    },
    production: {
        apiBase: 'https://your-production-api.com', // Update this
        environment: 'production'
    }
};

// Files that need API endpoint updates
const filesToUpdate = [
    'popup.js',
    'background.js',
    'content.js'
];

function updateApiEndpoints(environment) {
    const env = config[environment];
    console.log(`Updating API endpoints for ${environment} environment...`);
    
    filesToUpdate.forEach(filename => {
        const filepath = path.join(__dirname, filename);
        
        if (fs.existsSync(filepath)) {
            let content = fs.readFileSync(filepath, 'utf8');
            
            // Update API base URL
            content = content.replace(
                /http:\/\/localhost:5000/g,
                env.apiBase
            );
            
            // Update environment-specific configurations
            if (environment === 'production') {
                content = content.replace(
                    /console\.log\(/g,
                    '// console.log('
                );
            }
            
            fs.writeFileSync(filepath, content);
            console.log(`✅ Updated ${filename}`);
        } else {
            console.warn(`⚠️  File not found: ${filename}`);
        }
    });
}

function createProductionBuild() {
    const buildDir = path.join(__dirname, 'dist');
    
    // Create dist directory
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // Copy extension files
    const filesToCopy = [
        'manifest.json',
        'popup.html',
        'popup.css',
        'popup.js',
        'background.js',
        'content.js'
    ];
    
    filesToCopy.forEach(filename => {
        const sourcePath = path.join(__dirname, filename);
        const destPath = path.join(buildDir, filename);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Copied ${filename}`);
        }
    });
    
    // Copy icons directory
    const iconsDir = path.join(__dirname, 'icons');
    const destIconsDir = path.join(buildDir, 'icons');
    
    if (fs.existsSync(iconsDir)) {
        if (!fs.existsSync(destIconsDir)) {
            fs.mkdirSync(destIconsDir, { recursive: true });
        }
        
        const iconFiles = fs.readdirSync(iconsDir);
        iconFiles.forEach(iconFile => {
            if (iconFile.endsWith('.png') || iconFile.endsWith('.svg')) {
                fs.copyFileSync(
                    path.join(iconsDir, iconFile),
                    path.join(destIconsDir, iconFile)
                );
                console.log(`✅ Copied icon: ${iconFile}`);
            }
        });
    }
    
    // Copy README
    const readmePath = path.join(__dirname, 'README.md');
    const destReadmePath = path.join(buildDir, 'README.md');
    
    if (fs.existsSync(readmePath)) {
        fs.copyFileSync(readmePath, destReadmePath);
        console.log(`✅ Copied README.md`);
    }
    
    console.log(`\n🎉 Production build created in: ${buildDir}`);
}

function validateExtension() {
    console.log('\n🔍 Validating extension...');
    
    // Check required files
    const requiredFiles = [
        'manifest.json',
        'popup.html',
        'popup.js',
        'background.js'
    ];
    
    let isValid = true;
    
    requiredFiles.forEach(filename => {
        const filepath = path.join(__dirname, filename);
        if (fs.existsSync(filepath)) {
            console.log(`✅ ${filename} exists`);
        } else {
            console.error(`❌ ${filename} missing`);
            isValid = false;
        }
    });
    
    // Validate manifest.json
    try {
        const manifestPath = path.join(__dirname, 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        if (manifest.manifest_version !== 3) {
            console.error('❌ Manifest version must be 3');
            isValid = false;
        }
        
        if (!manifest.name || !manifest.version) {
            console.error('❌ Manifest missing required fields');
            isValid = false;
        }
        
        console.log('✅ manifest.json is valid');
    } catch (error) {
        console.error('❌ manifest.json is invalid JSON');
        isValid = false;
    }
    
    // Check icons
    const iconsDir = path.join(__dirname, 'icons');
    if (fs.existsSync(iconsDir)) {
        const iconFiles = fs.readdirSync(iconsDir);
        const requiredIcons = ['icon16.png', 'icon48.png', 'icon128.png'];
        
        requiredIcons.forEach(icon => {
            if (iconFiles.includes(icon)) {
                console.log(`✅ ${icon} exists`);
            } else {
                console.warn(`⚠️  ${icon} missing (recommended)`);
            }
        });
    } else {
        console.warn('⚠️  Icons directory missing');
    }
    
    if (isValid) {
        console.log('\n✅ Extension validation passed!');
    } else {
        console.log('\n❌ Extension validation failed!');
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
SubTrackr Chrome Extension Build Script

Usage: node build.js [command]

Commands:
  dev          Update endpoints for development
  prod         Update endpoints for production
  build        Create production build
  validate     Validate extension files
  help         Show this help message

Examples:
  node build.js dev        # Set development endpoints
  node build.js prod       # Set production endpoints
  node build.js build      # Create production build
  node build.js validate   # Validate extension
`);
}

// Main execution
const command = process.argv[2] || 'help';

switch (command) {
    case 'dev':
        updateApiEndpoints('development');
        break;
    case 'prod':
        updateApiEndpoints('production');
        break;
    case 'build':
        updateApiEndpoints('production');
        createProductionBuild();
        break;
    case 'validate':
        validateExtension();
        break;
    case 'help':
    default:
        showHelp();
        break;
}

