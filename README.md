# NeuroLabs - Machine Learning Portfolio

An interactive website showcasing machine learning demonstrations built with React, featuring:

- **KNN (K-Nearest Neighbors)** - Interactive classification visualization
- **Linear Regression** - Gradient descent explorer with real-time visualization
- **Genetic Algorithms** - Music evolution through directed optimization
- **Q-Learning** - Multi-agent reinforcement learning with Pong game

## Features

✨ **Interactive Visualizations** - Real-time canvas-based ML algorithm demonstrations
📱 **Responsive Design** - Beautiful dark theme with smooth animations
🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion
🔄 **Fullscreen Mode** - View visualizations in fullscreen for better presentation
🎯 **Educational** - Learn ML concepts through interactive exploration

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/michal-kocher/Neurolabs_Website.git
cd Neurolabs_Website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist` folder.

## Usage

### KNN Sandbox
- Click on the canvas to add classification points
- Use the slider to adjust K (number of nearest neighbors)
- Watch how the algorithm classifies new points in real-time

### Regression Sandbox
- Click to add data points
- Adjust the Learning Rate slider to control optimization speed
- Watch the gradient descent line adapt to fit the data
- The line always passes through the center of the viewport

### Evolution Sandbox
- Start the evolution process with "TURBO EVOLUTION"
- Watch as the genetic algorithm optimizes a melody
- Listen to the harmonic progression as fitness improves
- The piano roll shows note selection across time

### Pong Q-Learning
- Watch two AI agents learn to play Pong using Q-Learning
- Toggle "TRYB TURBO" to accelerate training
- Export the trained brain as JSON for further analysis
- Reset to start training from scratch

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages on every push to `main`:

**Live Demo:** [https://michal-kocher.github.io/Neurolabs_Website](https://michal-kocher.github.io/Neurolabs_Website)

### Manual Deployment

If automatic deployment doesn't work:

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically build and deploy on next push

## Project Structure

```
src/
├── components/
│   ├── KNNSandbox.jsx           # KNN visualization
│   ├── RegressionSandbox.jsx    # Gradient descent visualization
│   ├── EvolutionSandbox.jsx     # Genetic algorithm visualization
│   ├── PongSandbox.jsx          # Q-Learning Pong game
│   ├── Navbar.jsx               # Navigation bar
│   ├── Footer.jsx               # Footer component
│   ├── NetworkCanvas.jsx        # Animated background
│   └── HeroCanvas.jsx           # Home page animation
├── pages/
│   ├── Home.jsx                 # Landing page
│   ├── KNN.jsx                  # KNN page
│   ├── Regression.jsx           # Regression page
│   ├── Music.jsx                # Evolution page
│   └── Pong.jsx                 # Q-Learning page
├── App.jsx                      # Main app with routing
└── main.jsx                     # Entry point
```

## Performance Optimization

- Canvas-based visualizations for smooth 60fps rendering
- Efficient state management with React hooks
- Responsive ResizeObserver for canvas sizing
- Lazy loading of components with React Router

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## Customization

### Styling
All colors and themes are defined in `tailwind.config.js` and use the purple accent color `#8E05C2`.

### Algorithm Parameters
Each sandbox has configurable parameters at the top of the component files:
- KNN: K value, distance metric
- Regression: Learning rate, initial parameters
- Evolution: Mutation rates, fitness function
- Pong: Q-Learning parameters, exploration rate

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**Michal Kocher** - AI Researcher & ML Engineer

- Email: michal.kocher.research@gmail.com
- GitHub: [@michal-kocher](https://github.com/michal-kocher)

## Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting improvements
- 📣 Sharing with others

## Acknowledgments

- Inspired by ML education and interactive visualization best practices
- Built with modern web technologies
- Community feedback and contributions

---

**Made with ❤️ by Michal Kocher**

