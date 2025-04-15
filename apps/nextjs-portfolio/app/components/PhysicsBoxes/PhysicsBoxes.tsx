import { Canvas } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";

const colors = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint
  "#FFEEAD", // Cream
  "#D4A5A5", // Dusty Rose
  "#9B59B6", // Purple
  "#3498DB", // Blue
  "#2ECC71", // Green
  "#F1C40F", // Yellow
];

const Box = ({
  position,
  text,
  color,
}: {
  position: [number, number, number];
  text: string;
  color: string;
}) => {
  const [ref] = useBox<Mesh>(() => ({
    mass: 0.5, // Lighter mass for more bouncy behavior
    position,
    args: [1, 1, 0.1], // Flatten the boxes for 2D look
    restitution: 0.8, // More bouncy
    friction: 0.1, // Less friction for more sliding
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={color} />
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="black"
      >
        {text}
      </Text>
    </mesh>
  );
};

const Floor = () => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -5, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
    </mesh>
  );
};

const Scene = () => {
  const traits = [
    "creative",
    "innovative",
    "passionate",
    "detail-oriented",
    "problem-solver",
    "collaborative",
    "curious",
    "analytical",
    "adaptable",
    "visionary",
  ];

  return (
    <Physics gravity={[0, -9.81, 0]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <Floor />
      {traits.map((trait, index) => (
        <Box
          key={trait}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 5 + 5,
            0, // Keep everything on the same Z plane for 2D look
          ]}
          text={trait}
          color={colors[index % colors.length]}
        />
      ))}
    </Physics>
  );
};

const PhysicsBoxes = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        orthographic
        camera={{
          position: [0, 0, 15],
          zoom: 30,
          near: 0.1,
          far: 1000,
          left: -5,
          right: 5,
          top: 5,
          bottom: -5,
        }}
        gl={{ alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default PhysicsBoxes;
