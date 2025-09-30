'use client';

// ============================================================================
// IMPORTS - Understanding 3D Libraries
// ============================================================================

// React Three Fiber: React wrapper for Three.js (the main 3D library)
import { Canvas, useFrame } from '@react-three/fiber';
// Drei: Helper components for common 3D operations
import { OrbitControls, Sphere, Stars, Html, useTexture } from '@react-three/drei';
// Standard React hooks
import { useRef, useState, useEffect, Suspense } from 'react';
// Three.js core classes for 3D objects and materials
import {
  Mesh, // A 3D object with geometry + material
  Vector3, // 3D coordinates (x, y, z)
  Group, // Container to group multiple 3D objects
  BufferGeometry, // Efficient way to store 3D shape data
  Float32BufferAttribute, // Data structure for vertex positions
  ShaderMaterial, // Custom material using GPU shaders
  LineBasicMaterial, // Material for drawing lines
  CanvasTexture, // Texture created from HTML canvas
} from 'three';
// TypeScript type for camera controls - using any for OrbitControls ref

// ============================================================================
// TYPE DEFINITIONS - Data Structures for Our 3D World
// ============================================================================

interface InteractiveGlobeProps {
  className?: string;
}

// Location data structure - each city on our globe
interface Location {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // City description
  lat: number; // Latitude (north/south position)
  lon: number; // Longitude (east/west position)
  color: string; // Color for the city point
  connections?: string[]; // Array of city IDs this city connects to
}

// ============================================================================
// DATA - Our World Cities and Their Connections
// ============================================================================

// Array of interesting locations around the world
// Each location has lat/lon coordinates that we'll convert to 3D positions
const LOCATIONS: Location[] = [
  {
    id: 'oslo',
    name: 'Oslo, Norway',
    description:
      'The capital of Norway, known for its beautiful fjords, Viking history, and modern architecture.',
    lat: 59.9139,
    lon: 10.7522,
    color: '#ff0000',
    connections: ['tokyo', 'london'], // Oslo connects to Tokyo and London
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    description: 'A bustling metropolis blending traditional culture with cutting-edge technology.',
    lat: 35.6762,
    lon: 139.6503,
    color: '#ff6b6b',
    connections: ['oslo', 'singapore'], // Tokyo connects to Oslo and Singapore
  },
  {
    id: 'newyork',
    name: 'New York, USA',
    description: 'The city that never sleeps, home to iconic landmarks and diverse culture.',
    lat: 40.7128,
    lon: -74.006,
    color: '#4f46e5',
    connections: ['london', 'rio'], // New York connects to London and Rio
  },
  {
    id: 'sydney',
    name: 'Sydney, Australia',
    description: 'Famous for its Opera House, Harbour Bridge, and stunning harbor views.',
    lat: -33.8688,
    lon: 151.2093,
    color: '#10b981',
    connections: ['singapore'], // Sydney connects to Singapore
  },
  {
    id: 'london',
    name: 'London, UK',
    description: 'Rich in history, culture, and tradition, with iconic landmarks like Big Ben.',
    lat: 51.5074,
    lon: -0.1278,
    color: '#f59e0b',
    connections: ['oslo', 'newyork', 'paris'], // London connects to Oslo, New York, and Paris
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro, Brazil',
    description: 'Known for its Carnival, Christ the Redeemer statue, and beautiful beaches.',
    lat: -22.9068,
    lon: -43.1729,
    color: '#ef4444',
    connections: ['newyork'], // Rio connects to New York
  },
  {
    id: 'paris',
    name: 'Paris, France',
    description: 'The City of Light, famous for the Eiffel Tower, Louvre, and romantic atmosphere.',
    lat: 48.8566,
    lon: 2.3522,
    color: '#ef4444',
    connections: ['london'], // Paris connects to London
  },
  {
    id: 'singapore',
    name: 'Singapore',
    description: 'A modern city-state known for its multicultural heritage and futuristic skyline.',
    lat: 1.3521,
    lon: 103.8198,
    color: '#ef4444',
    connections: ['tokyo', 'sydney'], // Singapore connects to Tokyo and Sydney
  },
];

// ============================================================================
// SHADERS - Custom GPU Code for Visual Effects
// ============================================================================

// Shaders are programs that run on the GPU (graphics card) for each pixel
// They're written in GLSL (OpenGL Shading Language) - similar to C

// VERTEX SHADER: Runs once per vertex (corner point) of a 3D object
// This shader prepares data for the fragment shader
const fresnelVertexShader = `
  varying vec3 vNormal;    // Surface direction at this point
  varying vec3 vPosition;  // 3D position of this point
  
  void main() {
    // Calculate the surface normal (direction perpendicular to surface)
    vNormal = normalize(normalMatrix * normal);
    // Store the 3D position for the fragment shader
    vPosition = position;
    // Convert 3D position to 2D screen coordinates
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// FRAGMENT SHADER: Runs once per pixel on screen
// This creates the atmospheric glow effect around Earth
const fresnelFragmentShader = `
  varying vec3 vNormal;    // Surface direction from vertex shader
  varying vec3 vPosition;  // 3D position from vertex shader
  
  void main() {
    // Calculate direction from this point to the camera
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    
    // FRESNEL EFFECT: Creates edge glow based on viewing angle
    // When you look at a sphere edge-on, it appears brighter
    float fresnel = 1.0 - max(dot(vNormal, viewDirection), 0.0);
    
    // Make the fresnel effect softer and more subtle
    fresnel = pow(fresnel, 2.0);
    
    // Add subtle noise for softer, more natural edges
    float noise = sin(vPosition.x * 8.0) * sin(vPosition.y * 8.0) * sin(vPosition.z * 8.0);
    fresnel += noise * 0.05;
    
    // Atmosphere color (light blue)
    vec3 atmosphereColor = vec3(0.5, 0.8, 1.0);
    // Make it very subtle
    float intensity = fresnel * 0.2;
    
    // Output the final color with transparency
    gl_FragColor = vec4(atmosphereColor, intensity);
  }
`;

// ============================================================================
// BACKGROUND EFFECTS - Animated Space Environment
// ============================================================================

// Animated nebula background component
// Creates a subtle animated background element far behind the Earth
const AnimatedNebula: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  // useFrame runs 60 times per second (60 FPS)
  // This is where we animate 3D objects
  useFrame(state => {
    if (meshRef.current) {
      // Slow rotation for subtle movement
      // elapsedTime is the total time since the app started
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      // Gentle swaying motion using sine wave
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}>
      {/* A flat plane geometry (like a piece of paper) */}
      <planeGeometry args={[100, 100]} />
      {/* Basic material with transparency */}
      <meshBasicMaterial
        transparent
        opacity={0.05} // Very transparent
        color="#4a148c" // Purple color
        side={2} // DoubleSide = visible from both sides
      />
    </mesh>
  );
};

// Distant galaxy effect
// Another background element for depth and visual interest
const DistantGalaxy: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(state => {
    if (meshRef.current) {
      // Very slow rotation around Z axis (spinning like a galaxy)
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={[30, 15, -80]}>
      {/* Smaller plane positioned off to the side */}
      <planeGeometry args={[40, 40]} />
      {/* Even more transparent than the nebula */}
      <meshBasicMaterial
        transparent
        opacity={0.02} // Barely visible
        color="#1a237e" // Dark blue
        side={2} // Visible from both sides
      />
    </mesh>
  );
};

// ============================================================================
// ATMOSPHERE EFFECT - Earth's Atmospheric Glow
// ============================================================================

// Fresnel atmosphere component
// Creates a subtle blue glow around Earth using custom shaders
const FresnelAtmosphere: React.FC = () => {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(state => {
    if (
      materialRef.current &&
      materialRef.current.uniforms &&
      materialRef.current.uniforms.cameraPosition
    ) {
      // Update camera position for fresnel calculation
      // The shader needs to know where the camera is to calculate the glow effect
      materialRef.current.uniforms.cameraPosition.value.copy(state.camera.position);
    }
  });

  return (
    // Slightly larger sphere than Earth to create the atmosphere effect
    <Sphere args={[1.52, 64, 64]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={fresnelVertexShader} // Custom vertex shader
        fragmentShader={fresnelFragmentShader} // Custom fragment shader
        transparent // Allow transparency
        side={2} // BackSide = only render the inside faces
        uniforms={{
          cameraPosition: { value: new Vector3(0, 0, 0) }, // Initialize with default value
        }}
      />
    </Sphere>
  );
};

// ============================================================================
// COORDINATE CONVERSION - From 2D Maps to 3D Space
// ============================================================================

// Convert lat/lon to 3D coordinates on sphere
// This is crucial: we need to convert 2D map coordinates to 3D positions on our sphere
const latLonToVector3 = (lat: number, lon: number, radius: number = 1.52) => {
  // Convert latitude to phi (spherical coordinate)
  // phi = 0 at north pole, π at south pole
  const phi = (90 - lat) * (Math.PI / 180);

  // Convert longitude to theta (spherical coordinate)
  // theta = 0 at prime meridian, π at international date line
  const theta = (lon + 180) * (Math.PI / 180);

  // Convert spherical coordinates to 3D Cartesian coordinates
  // This is the standard spherical to Cartesian conversion formula
  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)), // X coordinate
    radius * Math.cos(phi), // Y coordinate
    radius * Math.sin(phi) * Math.sin(theta), // Z coordinate
  );
};

// ============================================================================
// CURVED LINE CREATION - Drawing Arcs Between Cities
// ============================================================================

// Create curved line between two points on sphere with enhanced curvature
// This creates a beautiful arc that curves outward from the sphere surface
const createCurvedLine = (start: Vector3, end: Vector3, segments: number = 40) => {
  const points: Vector3[] = [];

  // Create multiple points along the curve for smooth rendering
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // Progress from 0 to 1

    // Spherical interpolation (slerp) for smooth curve on sphere surface
    // This ensures the line follows the sphere's curvature
    const startNormalized = start.clone().normalize();
    const endNormalized = end.clone().normalize();

    // Calculate angle between the two vectors
    const dot = startNormalized.dot(endNormalized);
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

    if (angle < 0.01) {
      // Points are very close, use simple linear interpolation
      points.push(start.clone().lerp(end, t));
    } else {
      // Enhanced spherical interpolation with extra curvature
      const sinAngle = Math.sin(angle);
      const startWeight = Math.sin((1 - t) * angle) / sinAngle;
      const endWeight = Math.sin(t * angle) / sinAngle;

      // Interpolate between the two points on the sphere surface
      const interpolated = startNormalized
        .clone()
        .multiplyScalar(startWeight)
        .add(endNormalized.clone().multiplyScalar(endWeight));

      // Add extra curvature by pushing the line outward from the sphere
      const radius = start.length();
      const curvatureFactor = 0.4; // How much to curve outward
      const curveOffset = Math.sin(t * Math.PI) * curvatureFactor;

      // Create the final curved point
      const curvedPoint = interpolated.multiplyScalar(radius + curveOffset);
      points.push(curvedPoint);
    }
  }

  return points;
};

// Create animated texture for lines
const createAnimatedLineTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Create gradient texture with much higher opacity
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'rgba(38, 198, 218, 0.3)'); // Teal, more visible
  gradient.addColorStop(0.3, 'rgba(38, 198, 218, 0.6)');
  gradient.addColorStop(0.5, 'rgba(77, 208, 225, 1.0)'); // Bright teal, fully opaque
  gradient.addColorStop(0.7, 'rgba(38, 198, 218, 0.6)');
  gradient.addColorStop(1, 'rgba(38, 198, 218, 0.3)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new CanvasTexture(canvas);
};

interface CurvedLineProps {
  start: Vector3;
  end: Vector3;
}

const CurvedLine: React.FC<CurvedLineProps> = ({ start, end }) => {
  const geometryRef = useRef<BufferGeometry>(null);
  const materialRef = useRef<LineBasicMaterial>(null);
  const [waveOffset] = useState(Math.random() * Math.PI * 2);
  const [texture] = useState(() => createAnimatedLineTexture());

  useEffect(() => {
    if (geometryRef.current) {
      const points = createCurvedLine(start, end);
      const positions = new Float32Array(points.length * 3);

      points.forEach((point, i) => {
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      });

      geometryRef.current.setAttribute('position', new Float32BufferAttribute(positions, 3));
    }
  }, [start, end]);

  // Animate texture offset for traveling wave effect
  useFrame(state => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      const waveSpeed = 0.05; // Speed of texture panning
      const waveOffsetTime = time + waveOffset;

      // Pan the texture along the line
      const offset = (waveOffsetTime * waveSpeed) % 1;
      texture.offset.x = offset;

      // Update texture
      texture.needsUpdate = true;

      // Dynamic color animation
      const hueShift = Math.sin(time * 0.8) * 0.1;
      const saturation = 0.7 + Math.sin(time * 1.2) * 0.2;
      const lightness = 0.5 + Math.sin(time * 0.6) * 0.1;

      materialRef.current.color.setHSL(0.5 + hueShift, saturation, lightness);
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial ref={materialRef} map={texture} transparent opacity={1.0} linewidth={12} />
    </line>
  );
};

interface LocationPointProps {
  location: Location;
  onLocationClick: (location: Location) => void;
  isSelected: boolean;
  cameraDistance: number;
}

const LocationPoint: React.FC<LocationPointProps> = ({
  location,
  onLocationClick,
  isSelected,
  cameraDistance,
}) => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const position = latLonToVector3(location.lat, location.lon);
  const [tooltipPosition, setTooltipPosition] = useState<Vector3>(new Vector3());

  useFrame(state => {
    if (meshRef.current && glowRef.current) {
      // Calculate dynamic size based on camera distance
      // Closer camera = smaller points, farther camera = larger points
      const baseSize = Math.max(0.012, Math.min(0.035, cameraDistance * 0.005)); // Larger base sizes for mobile

      // Enhanced pulsing animation with different speeds for selected/hovered states
      const pulseSpeed = isSelected ? 3 : 2;
      const pulseIntensity = isSelected ? 0.15 : 0.05;
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseIntensity;

      // Apply different scales based on state
      let finalScale = scale;
      if (hovered) finalScale *= 1.4;
      if (isSelected) finalScale *= 1.2;

      // Apply the base size scaling with mobile-friendly sizing
      meshRef.current.scale.setScalar((finalScale * baseSize) / 0.02); // Normalize to base size
      glowRef.current.scale.setScalar((finalScale * 2.0 * baseSize) / 0.04); // Larger glow for better touch targets
    }

    // Calculate optimal tooltip position to avoid overlap
    if (showTooltip) {
      const cameraPosition = state.camera.position;
      const directionToCamera = cameraPosition.clone().sub(position).normalize();

      // Position tooltip away from camera direction with better offset
      const tooltipOffset = 0.4; // Increased offset for better separation
      const optimalPosition = position
        .clone()
        .add(directionToCamera.clone().multiplyScalar(-tooltipOffset));

      // Add slight upward offset to make it more readable
      optimalPosition.y += 0.1;

      setTooltipPosition(optimalPosition);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    // Delay tooltip appearance to avoid interfering with clicks
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 100); // Very fast tooltip for mobile responsiveness
  };

  const handlePointerOut = () => {
    setHovered(false);
    setShowTooltip(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleClick = () => {
    // Hide tooltip immediately when clicking
    setShowTooltip(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    onLocationClick(location);
  };

  // Dynamic colors and opacity based on state
  const getPointColor = () => {
    if (isSelected) return '#ff6b35'; // Bright orange for selected
    if (hovered) return '#4dd0e1'; // Brighter teal for hover
    return '#26c6da'; // Default teal accent color
  };

  const getGlowOpacity = () => {
    if (isSelected) return hovered ? 0.9 : 0.8;
    if (hovered) return 0.7;
    return 0.5;
  };

  const getMainOpacity = () => {
    if (isSelected) return 1.0;
    if (hovered) return 1.0;
    return 1.0; // All points fully opaque
  };

  return (
    <group>
      {/* Enhanced outer glow effect - larger for mobile touch targets */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={getPointColor()} transparent opacity={getGlowOpacity()} />
      </mesh>

      {/* Main point with enhanced visual feedback - larger base size */}
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={getPointColor()} transparent opacity={getMainOpacity()} />
      </mesh>

      {/* Invisible larger touch target for mobile */}
      <mesh
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Enhanced tooltip with smart positioning */}
      {showTooltip && (
        <Html position={tooltipPosition} center>
          <div className="bg-black/95 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl pointer-events-none border border-white/20">
            {location.name}
            {isSelected && <span className="ml-2">✓</span>}
          </div>
        </Html>
      )}
    </group>
  );
};

interface EarthGlobeProps {
  isHovered: boolean;
  isCitySelected: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  selectedLocation: Location | null;
  onGlobeHover: (hovered: boolean) => void;
}

const EarthGlobe: React.FC<EarthGlobeProps> = ({
  isHovered,
  isCitySelected,
  locations,
  onLocationClick,
  selectedLocation,
  onGlobeHover,
}) => {
  const meshRef = useRef<Group>(null);
  const rotationRef = useRef(0);
  const [cameraDistance, setCameraDistance] = useState(4.5);

  // Load Earth textures with error handling
  const earthTexture = useTexture('/images/earth-texture.jpg');
  const roughnessTexture = useTexture('/images/earth-roughness-inverted.jpg');

  // Fix texture alignment
  useEffect(() => {
    if (earthTexture) {
      earthTexture.flipY = false;
      earthTexture.wrapS = earthTexture.wrapT = 1000;
    }
    if (roughnessTexture) {
      roughnessTexture.flipY = false;
      roughnessTexture.wrapS = roughnessTexture.wrapT = 1000;
    }
  }, [earthTexture, roughnessTexture]);

  useFrame(state => {
    if (meshRef.current && !isHovered && !isCitySelected) {
      // Increment rotation at exact same speed
      rotationRef.current += 0.0005;

      // Apply rotation to mesh
      meshRef.current.rotation.y = rotationRef.current;
    }

    // Track camera distance for dynamic point sizing
    setCameraDistance(state.camera.position.length());
  });

  return (
    <group ref={meshRef}>
      {/* Fresnel atmosphere */}
      <FresnelAtmosphere />

      {/* Main Earth sphere */}
      <Sphere
        args={[1.5, 64, 64]}
        onPointerOver={() => onGlobeHover(true)}
        onPointerOut={() => onGlobeHover(false)}
      >
        <meshStandardMaterial
          map={earthTexture}
          roughnessMap={roughnessTexture}
          color="#ffffff"
          roughness={1}
          metalness={0.05}
        />
      </Sphere>

      {/* Curved lines connecting cities based on connections array */}
      {locations.map(location => {
        if (!location.connections) return null;

        return location.connections.map(connectedId => {
          const connectedLocation = locations.find(loc => loc.id === connectedId);
          if (!connectedLocation) return null;

          const startPos = latLonToVector3(location.lat, location.lon, 1.52);
          const endPos = latLonToVector3(connectedLocation.lat, connectedLocation.lon, 1.52);

          // Avoid duplicate lines by only rendering if current location ID is smaller than connected ID
          if (location.id < connectedId) {
            return (
              <CurvedLine
                key={`line-${location.id}-${connectedId}`}
                start={startPos}
                end={endPos}
              />
            );
          }
          return null;
        });
      })}

      {/* Location Points - now children of rotating group with enhanced props */}
      {locations.map(location => (
        <LocationPoint
          key={location.id}
          location={location}
          onLocationClick={onLocationClick}
          isSelected={selectedLocation?.id === location.id}
          cameraDistance={cameraDistance}
        />
      ))}
    </group>
  );
};

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);
  const [isGlobeHovered, setIsGlobeHovered] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Handle window resize to recalculate camera positions
    const handleResize = () => {
      // Force a re-render when window is resized
      // This will help with responsive camera positioning
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animateCameraToLocation = (targetPosition: Vector3, isZoomOut: boolean = false) => {
    if (!controlsRef.current) return;

    const startTime = Date.now();
    const phaseDuration = 1000; // 1 second per phase
    const totalDuration = isZoomOut ? phaseDuration : phaseDuration * 2; // Two phases: zoom out then zoom in

    // Calculate responsive distances based on viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = viewportWidth / viewportHeight;

    // Adjust distances based on aspect ratio for better centering
    const baseWideDistance = 6.0;
    const baseCloseDistance = 2.8;

    // For wider screens, we need to zoom in more to center properly
    const aspectRatioFactor = Math.max(0.8, Math.min(1.2, aspectRatio));

    const wideDistance = baseWideDistance * aspectRatioFactor;
    const closeDistance = baseCloseDistance * aspectRatioFactor;

    // Calculate the target camera position to face the city
    const cityDirection = targetPosition.clone().normalize();
    const targetDistance = isZoomOut ? wideDistance : closeDistance;
    const targetCameraPosition = cityDirection.clone().multiplyScalar(targetDistance);

    // Calculate spherical coordinates for smooth rotation - more robust calculation
    const startPosition = controlsRef.current.object.position.clone();
    const startRadius = startPosition.length();
    const startSpherical = {
      radius: startRadius,
      phi:
        startRadius > 0.001
          ? Math.acos(Math.max(-1, Math.min(1, startPosition.y / startRadius)))
          : 0,
      theta: Math.atan2(startPosition.z, startPosition.x),
    };

    const targetRadius = targetCameraPosition.length();
    const targetSpherical = {
      radius: targetRadius,
      phi:
        targetRadius > 0.001
          ? Math.acos(Math.max(-1, Math.min(1, targetCameraPosition.y / targetRadius)))
          : 0,
      theta: Math.atan2(targetCameraPosition.z, targetCameraPosition.x),
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Smoother easing function
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      let easedProgress = easeInOutCubic(progress);

      // Debug logging for first frame
      if (progress < 0.01) {
        console.log('Animation start:', {
          startSpherical,
          targetSpherical,
          targetPosition: targetPosition.toArray(),
          cityDirection: cityDirection.toArray(),
        });
      }

      // For two-phase animation (zoom out then zoom in)
      if (!isZoomOut) {
        if (progress < 0.5) {
          // Phase 1: Zoom out to wide view
          const phaseProgress = progress * 2; // 0 to 1
          easedProgress = easeInOutCubic(phaseProgress);

          // Interpolate to wide distance
          const currentRadius =
            startSpherical.radius + (wideDistance - startSpherical.radius) * easedProgress;

          // Handle theta wrapping for shortest path
          let deltaTheta = targetSpherical.theta - startSpherical.theta;
          if (deltaTheta > Math.PI) deltaTheta -= 2 * Math.PI;
          if (deltaTheta < -Math.PI) deltaTheta += 2 * Math.PI;

          const currentTheta = startSpherical.theta + deltaTheta * easedProgress;
          const currentPhi =
            startSpherical.phi + (targetSpherical.phi - startSpherical.phi) * easedProgress;

          // Convert back to Cartesian coordinates
          const newPosition = new Vector3(
            currentRadius * Math.sin(currentPhi) * Math.cos(currentTheta),
            currentRadius * Math.cos(currentPhi),
            currentRadius * Math.sin(currentPhi) * Math.sin(currentTheta),
          );

          controlsRef.current.object.position.copy(newPosition);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        } else {
          // Phase 2: Zoom in to close view (already at correct angle)
          const phaseProgress = (progress - 0.5) * 2; // 0 to 1
          easedProgress = easeInOutCubic(phaseProgress);

          // Start from wide distance and zoom to close distance
          const currentRadius = wideDistance + (closeDistance - wideDistance) * easedProgress;

          // Use the final target angle (no more rotation needed)
          const currentTheta = targetSpherical.theta;
          const currentPhi = targetSpherical.phi;

          // Convert back to Cartesian coordinates
          const newPosition = new Vector3(
            currentRadius * Math.sin(currentPhi) * Math.cos(currentTheta),
            currentRadius * Math.cos(currentPhi),
            currentRadius * Math.sin(currentPhi) * Math.sin(currentTheta),
          );

          controlsRef.current.object.position.copy(newPosition);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      } else {
        // Single phase: just zoom out
        const currentRadius =
          startSpherical.radius + (targetDistance - startSpherical.radius) * easedProgress;

        // Handle theta wrapping for shortest path
        let deltaTheta = targetSpherical.theta - startSpherical.theta;
        if (deltaTheta > Math.PI) deltaTheta -= 2 * Math.PI;
        if (deltaTheta < -Math.PI) deltaTheta += 2 * Math.PI;

        const currentTheta = startSpherical.theta + deltaTheta * easedProgress;
        const currentPhi =
          startSpherical.phi + (targetSpherical.phi - startSpherical.phi) * easedProgress;

        // Convert back to Cartesian coordinates
        const newPosition = new Vector3(
          currentRadius * Math.sin(currentPhi) * Math.cos(currentTheta),
          currentRadius * Math.cos(currentPhi),
          currentRadius * Math.sin(currentPhi) * Math.sin(currentTheta),
        );

        controlsRef.current.object.position.copy(newPosition);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Debug logging for final position
        console.log('Animation complete:', {
          finalPosition: controlsRef.current.object.position.toArray(),
          targetPosition: targetPosition.toArray(),
          distance: controlsRef.current.object.position.distanceTo(targetPosition),
        });
      }
    };

    animate();
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    console.log('Clicked location:', location);

    // Calculate position on globe surface - this is what we want to face
    const position = latLonToVector3(location.lat, location.lon, 1.5);
    console.log('Target position:', position);

    // Animate camera to orbit around and face this position with two-phase animation
    animateCameraToLocation(position, false); // false = two-phase animation (zoom out then zoom in)
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      // First zoom out to wide view, then reset to original position
      const currentPosition = controlsRef.current.object.position.clone();
      const widePosition = currentPosition.clone().normalize().multiplyScalar(6.0);

      // Animate to wide view first
      animateCameraToLocation(widePosition, true); // true = single phase (just zoom out)

      // Then reset to original position after a delay
      setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.object.position.set(0, 0, 4.5);
          controlsRef.current.update();
        }
      }, 1000); // Wait for zoom-out animation to complete
    }
    setSelectedLocation(null); // Also close the modal
  };

  if (!isClient) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-surface-elevated rounded-2xl`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-surface rounded w-32 mx-auto mb-2" />
          <div className="h-3 bg-surface rounded w-24 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      {/* Mobile Layout: Stacked vertically */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 h-full">
        {/* 3D Globe - Square aspect ratio on mobile, 2/3 on desktop */}
        <div className="aspect-square lg:col-span-2 lg:aspect-auto relative bg-surface-elevated rounded-lg overflow-hidden lg:flex-1">
          {/* Reset View Button - Small icon in top-right corner */}
          <button
            onClick={resetCamera}
            className="absolute top-2 right-2 lg:top-4 lg:right-4 z-10 w-8 h-8 lg:w-10 lg:h-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20"
            title="Reset View"
          >
            <span className="text-white text-sm lg:text-lg">🌍</span>
          </button>

          {/* Location Details Card - Full screen modal on mobile, overlay on desktop */}
          {selectedLocation && (
            <>
              {/* Mobile: Ultra-compact overlay panel */}
              <div className="lg:hidden absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-sm text-gray-900 pr-2 truncate">
                    {selectedLocation.name}
                  </h3>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                  {selectedLocation.description}
                </p>

                {/* Connected Cities */}
                {selectedLocation.connections && selectedLocation.connections.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-xs font-medium">Connections:</span>
                    <div className="flex gap-1">
                      {selectedLocation.connections.map(connectedId => {
                        const connectedCity = LOCATIONS.find(loc => loc.id === connectedId);
                        return connectedCity ? (
                          <button
                            key={connectedId}
                            onClick={() => handleLocationClick(connectedCity)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
                          >
                            {connectedCity.name.split(',')[0]}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop: Corner overlay */}
              <div className="hidden lg:block absolute bottom-4 left-4 z-10 max-w-sm bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/20">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 pr-2">
                    {selectedLocation.name}
                  </h3>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-3">{selectedLocation.description}</p>

                {/* Connected Cities */}
                {selectedLocation.connections && selectedLocation.connections.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-gray-900 text-sm font-medium mb-2">Connected Cities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedLocation.connections.map(connectedId => {
                        const connectedCity = LOCATIONS.find(loc => loc.id === connectedId);
                        return connectedCity ? (
                          <button
                            key={connectedId}
                            onClick={() => handleLocationClick(connectedCity)}
                            className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium transition-colors"
                          >
                            {connectedCity.name.split(',')[0]}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            style={{
              background: `
                radial-gradient(circle at 30% 20%, #1a1a2e 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, #16213e 0%, transparent 50%),
                radial-gradient(circle at center, #0f172a 0%, #000000 100%)
              `,
            }}
          >
            {/* Enhanced multi-layer starfield */}
            <Stars radius={200} depth={100} count={2000} factor={6} saturation={0.1} fade={true} />

            {/* Additional star layer for depth */}
            <Stars radius={300} depth={150} count={1500} factor={3} saturation={0.05} fade={true} />

            {/* Distant nebula-like effect */}
            <Stars radius={500} depth={200} count={800} factor={1} saturation={0.2} fade={true} />

            {/* Animated background elements */}
            <AnimatedNebula />
            <DistantGalaxy />

            {/* Space lighting with static sun */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[50, 0, 0]} intensity={2.5} />

            {/* Static sun - positioned realistically far away */}
            <mesh position={[50, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshBasicMaterial color="#ffaa00" />
            </mesh>

            {/* Earth Globe */}
            <group>
              <Suspense
                fallback={
                  <Sphere args={[1.5, 64, 64]}>
                    <meshStandardMaterial color="#2c5aa0" roughness={0.8} metalness={0.1} />
                  </Sphere>
                }
              >
                <EarthGlobe
                  isHovered={isGlobeHovered}
                  isCitySelected={!!selectedLocation}
                  locations={LOCATIONS}
                  onLocationClick={handleLocationClick}
                  selectedLocation={selectedLocation}
                  onGlobeHover={setIsGlobeHovered}
                />
              </Suspense>
            </group>

            {/* Controls */}
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={!isGlobeHovered && !selectedLocation}
              autoRotateSpeed={0.5}
              minDistance={2.0}
              maxDistance={8}
              dampingFactor={0.05}
              enableDamping={true}
              zoomSpeed={0.8}
              panSpeed={0}
              screenSpacePanning={false}
            />
          </Canvas>
        </div>

        {/* Side Menu - Horizontal scroll on mobile, vertical on desktop */}
        <div className="lg:col-span-1 bg-surface-elevated rounded-lg p-3 lg:p-4 overflow-hidden lg:overflow-y-auto">
          <h3 className="text-text-primary text-base lg:text-lg font-semibold mb-3 lg:mb-4">
            Locations
          </h3>

          {/* Mobile: Horizontal scroll */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
            {LOCATIONS.map(location => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={`flex-shrink-0 text-center px-4 py-3 rounded-lg text-sm transition-colors min-w-[120px] ${
                  selectedLocation?.id === location.id
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'hover:bg-surface text-text-secondary hover:text-text-primary border border-transparent'
                }`}
              >
                <div className="font-medium">{location.name.split(',')[0]}</div>
                <div className="text-xs opacity-75">{location.name.split(',')[1]?.trim()}</div>
              </button>
            ))}
          </div>

          {/* Desktop: Vertical list */}
          <div className="hidden lg:block space-y-2">
            {LOCATIONS.map(location => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                  selectedLocation?.id === location.id
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'hover:bg-surface text-text-secondary hover:text-text-primary border border-transparent'
                }`}
              >
                <div className="font-medium">{location.name.split(',')[0]}</div>
                <div className="text-xs opacity-75">{location.name.split(',')[1]?.trim()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;
