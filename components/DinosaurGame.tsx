"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"

interface GameState {
  score: number
  isGameOver: boolean
  isPlaying: boolean
  isPaused: boolean
  highScore: number
}

interface GameObject {
  mesh: THREE.Mesh
  type: "cactus" | "pterodactyl"
  passed: boolean
}

const DinosaurGame = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    startGame: () => void
    cleanup: () => void
  } | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isGameOver: false,
    isPlaying: false,
    isPaused: false,
    highScore: 0,
  })
  const [isMobile, setIsMobile] = useState(false)

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Загрузка рекорда из localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("dinosaur-game-high-score")
    if (savedHighScore) {
      setGameState((prev) => ({ ...prev, highScore: Number.parseInt(savedHighScore) }))
    }
  }, [])

  const initGame = useCallback(() => {
    if (!mountRef.current) return

    // Очистка предыдущей сцены
    if (gameRef.current) {
      gameRef.current.cleanup()
    }

    // Инициализация Three.js сцены
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x87ceeb, 1) // Ensure sky blue background with full opacity
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Очистка контейнера
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Земля
    const groundGeometry = new THREE.PlaneGeometry(1000, 20)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xd2b48c })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -5
    ground.receiveShadow = true
    scene.add(ground)

    camera.position.set(8, 3, 12) // Position camera for side view
    camera.lookAt(-5, -1, 0) // Look directly at the dinosaur

    let dinosaur: THREE.Group | null = null
    let obstacles: GameObject[] = []
    const clouds: THREE.Mesh[] = []
    let isJumping = false
    let isDucking = false
    let jumpVelocity = 0
    let gameSpeed = 0.1
    let score = 0
    let gameRunning = false
    let lastObstacleX = 20
    let animationId: number
    let dinoLoaded = false

    let isChargingJump = false
    let isTouchCharging = false
    const minJumpPower = 0.6
    const maxJumpPower = 1.0
    let jumpStartTime: number
    const maxChargeTime = 1000
    let touchStartTime: number
    const gravity = -0.025

    const createDinosaur = async () => {
      console.log("Creating simple geometric dinosaur...")

      const dinoGroup = new THREE.Group()

      // Body - main torso
      const bodyGeometry = new THREE.BoxGeometry(3, 2, 1.5)
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0, 0)
      body.castShadow = true
      dinoGroup.add(body)

      // Head - distinctive T-Rex head
      const headGeometry = new THREE.BoxGeometry(2, 1.5, 1.2)
      const head = new THREE.Mesh(headGeometry, bodyMaterial)
      head.position.set(2.5, 0.5, 0)
      head.castShadow = true
      dinoGroup.add(head)

      // Eyes - bright white for visibility
      const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8)
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })

      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(3.2, 0.8, 0.4)
      dinoGroup.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(3.2, 0.8, -0.4)
      dinoGroup.add(rightEye)

      // Pupils
      const pupilGeometry = new THREE.SphereGeometry(0.1, 8, 8)
      const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })

      const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
      leftPupil.position.set(3.3, 0.8, 0.4)
      dinoGroup.add(leftPupil)

      const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
      rightPupil.position.set(3.3, 0.8, -0.4)
      dinoGroup.add(rightPupil)

      // Legs - strong T-Rex legs
      const legGeometry = new THREE.BoxGeometry(0.8, 3, 0.8)
      const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      leftLeg.position.set(-0.5, -2.5, 0.6)
      leftLeg.castShadow = true
      dinoGroup.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      rightLeg.position.set(-0.5, -2.5, -0.6)
      rightLeg.castShadow = true
      dinoGroup.add(rightLeg)

      // Feet
      const footGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.8)
      const leftFoot = new THREE.Mesh(footGeometry, bodyMaterial)
      leftFoot.position.set(-0.3, -4, 0.6)
      leftFoot.castShadow = true
      dinoGroup.add(leftFoot)

      const rightFoot = new THREE.Mesh(footGeometry, bodyMaterial)
      rightFoot.position.set(-0.3, -4, -0.6)
      rightFoot.castShadow = true
      dinoGroup.add(rightFoot)

      // Arms - small T-Rex arms
      const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3)
      const leftArm = new THREE.Mesh(armGeometry, bodyMaterial)
      leftArm.position.set(0.8, 0.2, 0.8)
      dinoGroup.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, bodyMaterial)
      rightArm.position.set(0.8, 0.2, -0.8)
      dinoGroup.add(rightArm)

      // Tail - long T-Rex tail
      const tailGeometry = new THREE.BoxGeometry(4, 0.8, 0.8)
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial)
      tail.position.set(-3.5, 0.2, 0)
      tail.castShadow = true
      dinoGroup.add(tail)

      // Position the entire dinosaur
      dinoGroup.position.set(-5, -1, 0) // Positioned on the ground level
      dinoGroup.scale.setScalar(0.8) // Reasonable size

      dinoGroup.userData = {
        mixer: null,
        runAction: null,
        originalY: -1,
        legs: [leftLeg, rightLeg],
        head: head,
        tail: tail,
      }

      scene.add(dinoGroup)
      console.log("Geometric dinosaur created and added to scene")
      return dinoGroup
    }

    const createCactus = (x: number) => {
      const cactusGeometry = new THREE.BoxGeometry(1, 3, 1)
      const cactusMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 })
      const cactus = new THREE.Mesh(cactusGeometry, cactusMaterial)
      cactus.position.set(x, -3.5, 0) // Adjusted for ground level
      cactus.castShadow = true
      scene.add(cactus)

      return {
        mesh: cactus,
        type: "cactus" as const,
        passed: false,
      }
    }

    const createPterodactyl = (x: number) => {
      const pteroGeometry = new THREE.BoxGeometry(2, 1, 0.5)
      const pteroMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
      const pterodactyl = new THREE.Mesh(pteroGeometry, pteroMaterial)
      pterodactyl.position.set(x, -1, 0) // Flying height for ducking mechanic
      pterodactyl.castShadow = true
      scene.add(pterodactyl)

      return {
        mesh: pterodactyl,
        type: "pterodactyl" as const,
        passed: false,
      }
    }

    const jump = (power: number) => {
      if (!isJumping && !isDucking && dinosaur) {
        isJumping = true
        jumpVelocity = power
      }
    }

    const duck = () => {
      if (!isJumping && dinosaur) {
        isDucking = true
        dinosaur.scale.y = 0.5
        dinosaur.position.y = dinosaur.userData.originalY - 0.3
      }
    }

    const stopDuck = () => {
      if (isDucking && dinosaur) {
        isDucking = false
        dinosaur.scale.y = 1
        dinosaur.position.y = dinosaur.userData.originalY
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameRunning) {
        if (event.code === "Space" || event.code === "ArrowUp" || event.code === "ArrowDown") {
          event.preventDefault()
          startGame()
        }
        return
      }

      if ((event.code === "Space" || event.code === "ArrowUp") && !isChargingJump) {
        event.preventDefault()
        isChargingJump = true
        jumpStartTime = Date.now()
        jump(minJumpPower)
      }

      if (event.code === "ArrowDown") {
        event.preventDefault()
        duck()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!gameRunning) return

      if ((event.code === "Space" || event.code === "ArrowUp") && isChargingJump) {
        event.preventDefault()
        isChargingJump = false

        if (isJumping && dinosaur) {
          const holdTime = Date.now() - jumpStartTime
          const chargeRatio = Math.min(holdTime / maxChargeTime, 1)
          const additionalPower = (maxJumpPower - minJumpPower) * chargeRatio
          jumpVelocity += additionalPower * 0.5
        }
      }

      if (event.code === "ArrowDown") {
        event.preventDefault()
        stopDuck()
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (!gameRunning) {
        event.preventDefault()
        startGame()
        return
      }

      event.preventDefault()
      isTouchCharging = true
      touchStartTime = Date.now()
      jump(minJumpPower)
    }

    const handleTouchEnd = (event: TouchEvent) => {
      if (!gameRunning) return

      event.preventDefault()
      if (isTouchCharging) {
        isTouchCharging = false

        if (isJumping && dinosaur) {
          const holdTime = Date.now() - touchStartTime
          const chargeRatio = Math.min(holdTime / maxChargeTime, 1)
          const additionalPower = (maxJumpPower - minJumpPower) * chargeRatio
          jumpVelocity += additionalPower * 0.5
        }
      }
    }

    const initializeDinosaur = async () => {
      try {
        dinosaur = await createDinosaur()
        dinoLoaded = true
        console.log("Dinosaur initialization complete")
      } catch (error) {
        console.error("Failed to initialize dinosaur:", error)
        dinoLoaded = false
      }
    }

    const startGame = () => {
      if (!gameRunning && dinoLoaded) {
        console.log("Starting game...")
        gameRunning = true
        score = 0
        gameSpeed = 0.1
        isJumping = false
        isDucking = false
        jumpVelocity = 0
        isChargingJump = false
        isTouchCharging = false

        obstacles.forEach((obj) => scene.remove(obj.mesh))
        obstacles = []
        lastObstacleX = 20

        if (dinosaur) {
          dinosaur.position.y = dinosaur.userData.originalY
          dinosaur.scale.y = 1
        }

        setGameState((prev) => ({
          ...prev,
          isPlaying: true,
          isGameOver: false,
          score: 0,
        }))
      }
    }

    const endGame = () => {
      gameRunning = false
      const finalScore = Math.floor(score / 10)

      setGameState((prev) => {
        const newHighScore = finalScore > prev.highScore ? finalScore : prev.highScore

        if (finalScore > prev.highScore) {
          localStorage.setItem("dinosaur-game-high-score", finalScore.toString())
        }

        return {
          ...prev,
          isGameOver: true,
          isPlaying: false,
          highScore: newHighScore,
          score: finalScore,
        }
      })
    }

    const checkCollisions = () => {
      if (!dinosaur || !gameRunning) return

      const dinoBox = new THREE.Box3().setFromObject(dinosaur)
      dinoBox.expandByScalar(-0.2) // Slightly smaller hitbox for fairness

      for (const obstacle of obstacles) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacle.mesh)
        obstacleBox.expandByScalar(-0.1)

        if (dinoBox.intersectsBox(obstacleBox)) {
          endGame()
          return
        }

        if (!obstacle.passed && obstacle.mesh.position.x < dinosaur.position.x) {
          obstacle.passed = true
        }
      }
    }

    const animateDinosaur = (deltaTime: number) => {
      if (!dinosaur || !gameRunning) return

      if (isJumping) {
        dinosaur.position.y += jumpVelocity
        jumpVelocity += gravity

        if (dinosaur.position.y <= dinosaur.userData.originalY) {
          dinosaur.position.y = dinosaur.userData.originalY
          isJumping = false
          jumpVelocity = 0
        }
      }

      if (dinosaur.userData.mixer) {
        dinosaur.userData.mixer.update(deltaTime)
      } else if (dinosaur.userData.legs) {
        const time = Date.now() * 0.01
        dinosaur.userData.legs[0].rotation.x = Math.sin(time) * 0.5
        dinosaur.userData.legs[1].rotation.x = Math.sin(time + Math.PI) * 0.5

        if (dinosaur.userData.head) {
          dinosaur.userData.head.rotation.y = Math.sin(time * 0.5) * 0.1
        }

        if (dinosaur.userData.tail) {
          dinosaur.userData.tail.rotation.y = Math.sin(time * 0.5) * 0.1
        }
      }
    }

    const spawnObstacles = () => {
      if (!gameRunning) return

      if (lastObstacleX - -5 < 15) {
        const obstacleX = lastObstacleX + Math.random() * 10 + 15

        if (Math.random() < 0.7) {
          obstacles.push(createCactus(obstacleX))
        } else {
          obstacles.push(createPterodactyl(obstacleX))
        }

        lastObstacleX = obstacleX
      }
    }

    let lastTime = 0
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      if (gameRunning) {
        animateDinosaur(deltaTime)
        spawnObstacles()

        obstacles.forEach((obstacle, index) => {
          obstacle.mesh.position.x -= gameSpeed * 60 * deltaTime
          if (obstacle.mesh.position.x < -20) {
            scene.remove(obstacle.mesh)
            obstacles.splice(index, 1)
          }
        })

        checkCollisions()

        score += gameSpeed * 60 * deltaTime
        setGameState((prev) => ({ ...prev, score: Math.floor(score / 10) }))

        gameSpeed = Math.min(0.3, 0.1 + score * 0.00001)
      }

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    // Event listeners
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    renderer.domElement.addEventListener("touchstart", handleTouchStart, { passive: false })
    renderer.domElement.addEventListener("touchend", handleTouchEnd, { passive: false })

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    const cleanup = () => {
      cancelAnimationFrame(animationId)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      renderer.domElement.removeEventListener("touchstart", handleTouchStart)
      renderer.domElement.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }

    gameRef.current = {
      scene,
      camera,
      renderer,
      startGame,
      cleanup,
    }

    initializeDinosaur()
    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    initGame()

    return () => {
      if (gameRef.current) {
        gameRef.current.cleanup()
      }
    }
  }, [initGame])

  const restartGame = () => {
    if (gameRef.current) {
      setTimeout(() => {
        gameRef.current?.startGame()
      }, 100)
    }
  }

  const handleJump = () => {
    if (gameRef.current && gameState.isPlaying) {
      const event = new KeyboardEvent("keydown", { code: "Space" })
      document.dispatchEvent(event)
      setTimeout(() => {
        const upEvent = new KeyboardEvent("keyup", { code: "Space" })
        document.dispatchEvent(upEvent)
      }, 200)
    }
  }

  const handleDuck = () => {
    if (gameRef.current && gameState.isPlaying) {
      const event = new KeyboardEvent("keydown", { code: "ArrowDown" })
      document.dispatchEvent(event)
      setTimeout(() => {
        const upEvent = new KeyboardEvent("keyup", { code: "ArrowDown" })
        document.dispatchEvent(upEvent)
      }, 300)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Game UI */}
      {gameState.isPlaying && (
        <div className="absolute top-4 left-4 text-white text-2xl font-mono drop-shadow-lg">
          Счет: {gameState.score}
        </div>
      )}

      {gameState.highScore > 0 && gameState.isPlaying && (
        <div className="absolute top-4 right-4 text-white text-xl font-mono drop-shadow-lg">
          Рекорд: {gameState.highScore}
        </div>
      )}

      {/* Start Screen */}
      {!gameState.isPlaying && !gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Google Dinosaur 3D</h1>
            <p className="text-xl mb-8">Нажмите любую клавишу или коснитесь экрана для начала</p>
            {gameState.highScore > 0 && <p className="text-lg">Лучший результат: {gameState.highScore}</p>}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Игра окончена!</h2>
            <p className="text-2xl mb-2">Счет: {gameState.score}</p>
            <p className="text-xl mb-8">Рекорд: {gameState.highScore}</p>
            <Button onClick={restartGame} size="lg" className="text-lg px-8 py-3">
              Играть снова
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && gameState.isPlaying && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button
            onTouchStart={handleJump}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full"
            size="lg"
          >
            ПРЫЖОК
          </Button>
          <Button
            onTouchStart={handleDuck}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-full"
            size="lg"
          >
            ПРИГНУТЬСЯ
          </Button>
        </div>
      )}

      {/* Instructions */}
      {!isMobile && gameState.isPlaying && (
        <div className="absolute bottom-4 left-4 text-white text-sm font-mono drop-shadow-lg">
          ПРОБЕЛ/↑ - прыжок | ↓ - пригнуться
        </div>
      )}
    </div>
  )
}

export default DinosaurGame
