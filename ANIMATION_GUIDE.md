# 🎨 Animation Guide for IndiaDrive

## 📦 Installed Components

### 1. **PageTransition** - Page Transitions
```jsx
// Automatically applied in layout.js
// Provides smooth page transitions when navigating between routes
```

### 2. **AnimatedCard** - Card Animations
```jsx
import AnimatedCard from '../_components/AnimatedCard';

<AnimatedCard className="card shadow-lg" delay={0.1}>
  <div className="card-body">
    <h5>Card Title</h5>
    <p>Card content with hover and tap animations</p>
  </div>
</AnimatedCard>
```

### 3. **AnimatedButton** - Button Animations
```jsx
import AnimatedButton from '../_components/AnimatedButton';

<AnimatedButton 
  className="btn btn-primary"
  onClick={handleClick}
>
  Click Me
</AnimatedButton>
```

### 4. **StaggeredList** - List Animations
```jsx
import StaggeredList, { StaggeredItem } from '../_components/StaggeredList';

<StaggeredList className="row">
  {items.map((item, index) => (
    <StaggeredItem key={item.id} className="col-md-4" delay={index * 0.1}>
      <div className="card">
        <div className="card-body">{item.name}</div>
      </div>
    </StaggeredItem>
  ))}
</StaggeredList>
```

### 5. **LoadingAnimation** - Loading States
```jsx
import LoadingAnimation, { PulseLoading, SpinnerLoading } from '../_components/LoadingAnimation';

// Three dots animation
<LoadingAnimation size="md" />

// Pulse animation
<PulseLoading />

// Spinner animation
<SpinnerLoading />
```

## 🎯 Usage Examples

### Homepage Banner (Already Implemented)
- Smooth slide-in animations for text and image
- Staggered text animations
- Hover effects on the car image

### Booking Cards
```jsx
import AnimatedCard from '../_components/AnimatedCard';

{bookings.map((booking, index) => (
  <AnimatedCard 
    key={booking.id} 
    className="col-md-6 mb-4"
    delay={index * 0.1}
  >
    <div className="card">
      <div className="card-body">
        <h5>{booking.title}</h5>
        <p>{booking.description}</p>
      </div>
    </div>
  </AnimatedCard>
))}
```

### Form Buttons
```jsx
import AnimatedButton from '../_components/AnimatedButton';

<AnimatedButton 
  type="submit"
  className="btn btn-primary btn-lg"
  disabled={isLoading}
>
  {isLoading ? <SpinnerLoading /> : 'Submit'}
</AnimatedButton>
```

### Navigation Links
```jsx
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Link href="/about" className="nav-link">
    About
  </Link>
</motion.div>
```

## 🎨 Animation Types Available

### 1. **Page Transitions**
- Fade in/out with scale
- Smooth slide transitions
- Configurable duration and easing

### 2. **Hover Effects**
- Scale up on hover
- Smooth transitions
- Tap feedback

### 3. **Staggered Animations**
- Sequential item animations
- Configurable delays
- Perfect for lists and grids

### 4. **Loading States**
- Three dots animation
- Pulse animation
- Spinner animation

### 5. **Scroll Animations**
- Fade in on scroll
- Slide in from sides
- Scale animations

## ⚡ Performance Tips

1. **Use `transform` properties** - They're GPU accelerated
2. **Avoid animating `width/height`** - Use `scale` instead
3. **Keep animations short** - 200-400ms is ideal
4. **Use `will-change` sparingly** - Only when needed
5. **Test on mobile** - Ensure smooth performance

## 🎛️ Customization

### Animation Variants
```jsx
const customVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

<motion.div
  variants={customVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Transition Options
```jsx
const transition = {
  duration: 0.4,
  ease: 'easeOut',
  delay: 0.2
};
```

## 🚀 Best Practices

1. **Consistency** - Use similar animations throughout
2. **Subtle** - Don't overdo animations
3. **Purposeful** - Animations should enhance UX
4. **Accessible** - Respect `prefers-reduced-motion`
5. **Performance** - Monitor frame rates

## 📱 Mobile Considerations

- Reduce animation complexity on mobile
- Use shorter durations
- Test touch interactions
- Ensure smooth 60fps performance

## 🎯 Implementation Checklist

- [x] Page transitions installed
- [x] Banner animations added
- [x] Loading animations created
- [x] Card animations ready
- [x] Button animations ready
- [x] List animations ready

## 🔧 Troubleshooting

### Common Issues:
1. **Animations not working** - Check if Framer Motion is installed
2. **Performance issues** - Reduce animation complexity
3. **Layout shifts** - Use `layout` prop for layout animations
4. **Mobile lag** - Simplify animations for mobile

### Debug Tips:
- Use React DevTools to inspect motion components
- Check browser performance tab
- Test on different devices
- Monitor Core Web Vitals 