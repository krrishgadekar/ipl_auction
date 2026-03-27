'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls, Sparkles } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function LogoModel() {
    const { scene } = useGLTF('/logo_model_compressed.glb');
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Slow continuous rotation
            groupRef.current.rotation.y += delta * 0.4;

            groupRef.current.scale.lerp(new THREE.Vector3(2.2, 2.2, 2.2), delta * 4.5);
        }
    });

    return (
        <group ref={groupRef} scale={[0, 0, 0]}>
            <primitive object={scene} />
        </group>
    );
}

function LoadingFallback() {
    return (
        <div className="logo3d-loader">
            <div className="logo3d-spinner" />
        </div>
    );
}

export default function Logo3D({ className = "logo3d-container" }: { className?: string }) {
    return (
        <div className={className} style={{ width: className === 'logo3d-container' ? undefined : '100%', height: className === 'logo3d-container' ? undefined : '100%' }}>
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    camera={{ position: [0, 0, 7.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 1.5]}
                    style={{ background: 'transparent' }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1.5} />
                    <directionalLight position={[-3, 2, -2]} intensity={0.5} />

                    <PresentationControls
                        global
                        rotation={[0, 0, 0]}
                        polar={[-Math.PI / 4, Math.PI / 4]}
                        azimuth={[-Math.PI / 4, Math.PI / 4]}
                    >
                        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
                            <LogoModel />
                        </Float>
                    </PresentationControls>

                    <Sparkles count={60} scale={4} size={1.8} speed={0.4} opacity={0.6} color="#2dd4a0" />
                    
                    <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />
                    <pointLight position={[0, 0, -5]} intensity={0.5} color="#2dd4a0" />
                </Canvas>
            </Suspense>
        </div>
    );
}

// Preload the model
useGLTF.preload('/logo_model_compressed.glb');
