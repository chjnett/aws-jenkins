'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeTruckCanvasProps {
    onPhaseChange: (phase: string) => void
}

export function ThreeTruckCanvas({ onPhaseChange }: ThreeTruckCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // --- CONFIG & STATE ---
        const CONFIG = {
            colors: {
                bodyDark: 0x1e293b,
                bodyBlue: 0x2d5eff,
                chrome: 0x94a3b8,
                glass: 0x111111,
                core: 0x00f2ff,
                road: 0xffffff
            }
        }

        const STATE = {
            phase: 'drive_in', // drive_in -> stopped -> opening -> login_ready -> closing -> driving_away -> completed
            doorOpen: 0,
            truckX: -22,
            speed: 0.12,
            timer: 0
        }

        // --- SCENE SETUP ---
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)

        const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
        camera.position.set(0, 2, 16)
        camera.lookAt(0, -0.5, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        containerRef.current.appendChild(renderer.domElement)

        // --- LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        scene.add(ambientLight)

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
        mainLight.position.set(10, 20, 10)
        mainLight.castShadow = true
        scene.add(mainLight)

        // --- TRUCK MODELING ---
        function createDetailedCab() {
            const cabGroup = new THREE.Group()
            const shape = new THREE.Shape()
            shape.moveTo(0, 0)
            shape.lineTo(2.2, 0)
            shape.quadraticCurveTo(2.4, 0, 2.4, 0.5)
            shape.lineTo(2.4, 1.2)
            shape.lineTo(1.8, 2.3)
            shape.lineTo(0.1, 2.3)
            shape.lineTo(0, 0)

            const extSettings = { depth: 1.7, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 }
            const geo = new THREE.ExtrudeGeometry(shape, extSettings)
            geo.translate(-1.1, 0, -0.85)

            const mat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.bodyBlue, metalness: 0.5, roughness: 0.2 })
            const cabMain = new THREE.Mesh(geo, mat)
            cabMain.castShadow = true
            cabGroup.add(cabMain)

            const winGeo = new THREE.BoxGeometry(1.2, 0.9, 1.75)
            const winMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 })
            const windowMesh = new THREE.Mesh(winGeo, winMat)
            windowMesh.position.set(0.6, 1.5, 0)
            cabGroup.add(windowMesh)

            return cabGroup
        }

        interface CargoObj {
            group: THREE.Group
            door: THREE.Group
            light: THREE.PointLight
        }

        function createDetailedCargo(): CargoObj {
            const cargoGroup = new THREE.Group()
            const w = 4.5, h = 2.4, d = 1.7
            const shellMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.bodyDark, metalness: 0.4, roughness: 0.3 })

            const bodyGeo = new THREE.BoxGeometry(w, h, d)
            const body = new THREE.Mesh(bodyGeo, shellMat)
            body.position.y = h / 2
            body.castShadow = true
            cargoGroup.add(body)

            const doorGeo = new THREE.BoxGeometry(1.8, h - 0.2, 0.1)
            const doorCanvas = document.createElement('canvas')
            doorCanvas.width = 128; doorCanvas.height = 128
            const ctx = doorCanvas.getContext('2d')
            if (ctx) {
                ctx.fillStyle = '#1e293b'
                ctx.fillRect(0, 0, 128, 128)
                ctx.fillStyle = '#ffe600'
                ctx.beginPath(); ctx.moveTo(64, 25); ctx.lineTo(80, 60); ctx.lineTo(60, 60); ctx.lineTo(70, 105); ctx.lineTo(40, 60); ctx.lineTo(60, 60); ctx.fill()
            }
            const doorTex = new THREE.CanvasTexture(doorCanvas)
            const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, metalness: 0.5, roughness: 0.2 })
            const door = new THREE.Mesh(doorGeo, doorMat)
            door.position.set(0, h / 2, d / 2 + 0.02)
            const doorPivot = new THREE.Group()
            doorPivot.add(door)
            cargoGroup.add(doorPivot)

            const coreGeo = new THREE.SphereGeometry(0.5, 32, 32)
            const coreMat = new THREE.MeshBasicMaterial({ color: CONFIG.colors.core })
            const core = new THREE.Mesh(coreGeo, coreMat)
            core.position.set(0, h / 2, 0)
            cargoGroup.add(core)

            const coreLight = new THREE.PointLight(CONFIG.colors.core, 0, 8)
            coreLight.position.set(0, h / 2, 0.8)
            cargoGroup.add(coreLight)

            return { group: cargoGroup, door: doorPivot, light: coreLight }
        }

        function createWheel() {
            const group = new THREE.Group()
            const tireGeo = new THREE.TorusGeometry(0.4, 0.18, 16, 40)
            const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1 })
            const tire = new THREE.Mesh(tireGeo, tireMat)
            group.add(tire)
            const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 16)
            const rimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.2 })
            const rim = new THREE.Mesh(rimGeo, rimMat)
            rim.rotation.x = Math.PI / 2
            group.add(rim)
            return group
        }

        // --- ASSEMBLE ---
        const truckRoot = new THREE.Group()
        const truckBody = new THREE.Group()
        truckRoot.add(truckBody)
        scene.add(truckRoot)
        truckRoot.position.y = -2.5

        const cab = createDetailedCab()
        cab.position.set(2.2, 0.6, 0)
        truckBody.add(cab)

        const cargoObj = createDetailedCargo()
        cargoObj.group.position.set(-1.4, 0.6, 0)
        truckBody.add(cargoObj.group)

        const chassis = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.3, 1.4), new THREE.MeshStandardMaterial({ color: 0x334155 }))
        chassis.position.y = 0.5
        truckBody.add(chassis)

        const wheels: THREE.Group[] = []
        const wPos = [{ x: -2.8, z: 0.8 }, { x: -1.4, z: 0.8 }, { x: 2.8, z: 0.8 }, { x: -2.8, z: -0.8 }, { x: -1.4, z: -0.8 }, { x: 2.8, z: -0.8 }]
        wPos.forEach(p => {
            const w = createWheel()
            w.position.set(p.x, 0.5, p.z)
            truckRoot.add(w)
            wheels.push(w)
        })

        // 도로
        const grid = new THREE.GridHelper(200, 100, 0xf1f5f9, 0xf8fafc)
        grid.position.y = -2.49
        scene.add(grid)

        // --- ANIMATION ---
        let time = 0
        let animationId: number

        function animate() {
            animationId = requestAnimationFrame(animate)
            time += 0.05

            switch (STATE.phase) {
                case 'drive_in':
                    STATE.truckX += STATE.speed
                    truckBody.position.y = Math.sin(time * 4) * 0.03
                    if (STATE.truckX >= 0) {
                        STATE.truckX = 0
                        STATE.phase = 'stopped'
                        STATE.timer = 0
                        onPhaseChange('stopped')
                    }
                    break

                case 'stopped':
                    STATE.timer++
                    if (STATE.timer > 30) {
                        STATE.phase = 'opening'
                        onPhaseChange('opening')
                    }
                    break

                case 'opening':
                    STATE.doorOpen += 0.02
                    cargoObj.door.position.x = STATE.doorOpen * 1.8
                    cargoObj.light.intensity = STATE.doorOpen * 5
                    if (STATE.doorOpen >= 1) {
                        STATE.doorOpen = 1
                        STATE.phase = 'login_ready'
                        STATE.timer = 0
                        onPhaseChange('login_ready')
                    }
                    break

                case 'login_ready':
                    STATE.timer++
                    cargoObj.light.intensity = 5 + Math.sin(time * 10) * 1.5
                    // Stay in login_ready until external trigger or infinite loop?
                    // The user script had: if(STATE.timer > 80) ... closing
                    // But we want it to stay ready for user to login.
                    // We can perhaps pause here until login happens, or just loop the light.
                    // Let's keep it looping for now.
                    break

                case 'closing':
                    STATE.doorOpen -= 0.03
                    cargoObj.door.position.x = STATE.doorOpen * 1.8
                    cargoObj.light.intensity = STATE.doorOpen * 5
                    if (STATE.doorOpen <= 0) {
                        STATE.doorOpen = 0
                        STATE.phase = 'driving_away'
                        STATE.timer = 0
                        onPhaseChange('driving_away')
                    }
                    break

                case 'driving_away':
                    STATE.truckX += STATE.speed * 1.8
                    truckBody.position.y = Math.sin(time * 6) * 0.04
                    if (STATE.truckX > 25) {
                        STATE.phase = 'completed'
                        onPhaseChange('completed')
                    }
                    break

                case 'completed':
                    break
            }

            truckRoot.position.x = STATE.truckX

            if (STATE.phase === 'drive_in' || STATE.phase === 'driving_away') {
                const rotS = (STATE.phase === 'driving_away') ? STATE.speed * 3.6 : STATE.speed * 2
                wheels.forEach(w => w.rotation.z -= rotS)
            }

            renderer.render(scene, camera)
        }

        animate()

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [onPhaseChange])

    return <div ref={containerRef} className="absolute inset-0 z-0 bg-white" />
}
