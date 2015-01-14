$(document).ready(function () {

    var sin = Math.sin,
        cos = Math.cos,
        pow = Math.pow,
        PI = Math.PI;

    var sceneWidth = window.innerWidth,
        sceneHeight = 0.75*window.innerHeight;

    var lastMouseX = -1;
    var lastMouseY = -1;
    var cubeBoundingBox = {
        xi: 0.39 * sceneWidth,
        yi: 0.17 * sceneHeight,
        xf: 0.6 * sceneWidth,
        yf: 0.55 * sceneHeight
    }

    var forwardTiltAngle = PI / 6;
    var initialRotationAmountY = PI * 4;
    var loadedTexturesCount = 0;
    var totalTexturesCount = 6;
    var isAnimationActive = false;
    var shouldRotateCube = false;
    var rotationReachedCallback;
    var targetRotationVector = new THREE.Vector3(0, 0, 0);
    var initialRotationVector = new THREE.Vector3(0, 0, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, sceneWidth/sceneHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(sceneWidth, sceneHeight);
    // Set background color to white
    renderer.setClearColor(0xFFFFFF, 1);
    var viewBox = renderer.domElement;
    document.body.appendChild(viewBox);
    renderer.domElement.id = "viewBox";

    var incrementTextureCountOnTextureLoad = function() {
        loadedTexturesCount++;
        if (loadedTexturesCount == totalTexturesCount) {
            didFinishLoadingTextures()
        }
    }

    var didFinishLoadingTextures = function() {
        // Initial rendering sequence
        $("#viewBox").animate({ opacity: 1 });
        snapCubeToRotation(forwardTiltAngle, initialRotationAmountY, 0, function() {
            $("#navigationPanel").animate({opacity: 0.7}, 250, function() {
                console.log("Initialization finished.");
                $("#about-control").hover(function() {
                    snapCubeToRotation(PI / 6, 0, 0)
                });
                $("#contact-control").hover(function() {
                    snapCubeToRotation(2 * PI / 3, 0, 0)
                });
                $("#projects-control").hover(function() {
                    snapCubeToRotation(PI / 6, PI / 2, 0)
                });
                $("#resume-control").hover(function() {
                    snapCubeToRotation(-PI / 3, 0, 0)
                });
            })
        });
    }

    var faceMaterials = [
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_graph.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_projects.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_contact.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_resume.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_whsieh.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture("face_empty.png", null, incrementTextureCountOnTextureLoad),
            transparent: true
        })
    ];

    var cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshFaceMaterial(faceMaterials));
    scene.add(cube);

    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    camera.position.z = 20;

    var beginAnimation = function() {
        console.log("Beginning animation...");
        isAnimationActive = true;
        animate();
    }

    var endAnimation = function() {
        console.log("Ending animation...");
        isAnimationActive = false;
    }

    var updateRotations = function() {
        if (!shouldRotateCube) // add zoom later
            endAnimation();

        if (shouldRotateCube) {
            if (pow(targetRotationVector.x - cube.rotation.x, 2) + pow(targetRotationVector.y - cube.rotation.y, 2) + pow(targetRotationVector.z - cube.rotation.z, 2) < 0.00005) {
                cube.rotation.x = renormalizeAngle(targetRotationVector.x);
                cube.rotation.y = renormalizeAngle(targetRotationVector.y);
                cube.rotation.z = renormalizeAngle(targetRotationVector.z);
                if (rotationReachedCallback)
                    rotationReachedCallback();

                shouldRotateCube = false;
                rotationReachedCallback = null;
            } else {
                cube.rotation.x += 0.1 * (targetRotationVector.x - cube.rotation.x);
                cube.rotation.y += 0.1 * (targetRotationVector.y - cube.rotation.y);
                cube.rotation.z += 0.1 * (targetRotationVector.z - cube.rotation.z);
            }
        }
    }

    var renormalizeAngle = function(theta) {
        while (theta > PI)
            theta -= 2*PI;

        while (theta < -PI)
            theta += 2*PI;

        return theta;
    }

    snapCubeToRotation = function(targetX, targetY, targetZ, onRotationReached) {
        shouldRotateCube = cube.rotation.x != targetX || cube.rotation.y != targetY || cube.rotation.z != targetZ;
        if (shouldRotateCube) {
            initialRotationVector = new THREE.Vector3(cube.rotation.x, cube.rotation.y, cube.rotation.z);
            targetRotationVector = new THREE.Vector3(targetX, targetY, targetZ);
            rotationReachedCallback = onRotationReached;
            beginAnimation();
        }
    }

    var vector3AsString = function(v) {
        return "<" + v.x + "," + v.y + "," + v.z + ">";
    }

    var animate = function() {
        updateRotations();
        renderer.render(scene, camera);
        if (isAnimationActive)
            requestAnimationFrame(animate);
    }

    window.onresize = function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
