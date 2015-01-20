$(function() {
    setTimeout(function () {
        // For convenience.
        var sin = Math.sin
            , cos = Math.cos
            , pow = Math.pow
            , abs = Math.abs
            , max = Math.max
            , min = Math.min
            , PI = Math.PI;

        console.log("Window dimensions are " + window.innerWidth + ", " + window.innerHeight);
        // Stores the viewport dimensions.
        var sceneWidth = window.innerWidth,
            sceneHeight = 0.8 * window.innerHeight;

        // Stores variables for initializing the cube.
        var forwardTiltAngle = PI / 6;
        var initialRotationAmountY = PI * 4;
        var loadedTexturesCount = 0;
        var totalTexturesCount = 6;

        // Used to track the current animation state.
        var isAnimationActive = false;
        var shouldRotateCube = false;
        var shouldZoomCube = false;
        var rotationReachedCallback;
        var targetRotationVector = new THREE.Vector3(0, 0, 0);
        var initialRotationVector = new THREE.Vector3(0, 0, 0);
        var targetZoomDistance = 0;
        var initialZoomDistance = 0;

        // Stores key rotation angles and distances for each state.
        var rotationAngles = {
            "#about-control": {
                "hover": new THREE.Vector3(forwardTiltAngle, 0, 0),
                "zoomed": new THREE.Vector3(0, 0, 0)
            },
            "#contact-control": {
                "hover": new THREE.Vector3(forwardTiltAngle + PI / 2, 0, 0),
                "zoomed": new THREE.Vector3(PI / 2, 0, 0)
            },
            "#projects-control": {
                "hover": new THREE.Vector3(forwardTiltAngle, PI / 2, 0),
                "zoomed": new THREE.Vector3(0, PI / 2, 0)
            },
            "#resume-control": {
                "hover": new THREE.Vector3(forwardTiltAngle - PI / 2, 0, 0),
                "zoomed": new THREE.Vector3(-PI / 2, 0, 0)
            }
        };
        var closeZDistance = 12;
        var farZDistance = 0;

        // Tracks UI state.
        var isInZoomedMode = false;
        var selectedFaceId = "#about-control";
        var currentPanelId = "";
        var isCurrentlyZoomingOut = false;

        // Three.js objects.
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(sceneWidth, sceneHeight);
        renderer.setClearColor(0xFFFFFF, 1);
        var viewBox = renderer.domElement;
        document.body.appendChild(viewBox);
        renderer.domElement.id = "viewBox";

        var resetContentPanelDimensions = function() {
            var contentPanelWidth = max(sceneWidth / 2, 640);
            $(".content-panel").css({
                width: contentPanelWidth,
                left: (sceneWidth - contentPanelWidth) / 2
            });
        }
        $(window).resize(function(event) {
            setTimeout(function() {
                sceneWidth = window.innerWidth;
                sceneHeight = 0.8 * window.innerHeight;
                $("#viewBox").css({
                    width: sceneWidth,
                    height: sceneHeight
                });
                renderer.render(scene, camera);
                resetContentPanelDimensions();
            }, 100);
        });
        // Want smooth animation in beginning, so delay the size update.
        setTimeout(function() {
            resetContentPanelDimensions();
        }, 800);

        var zoomToDistance = function(targetZoom, animationComplete) {
            shouldZoomCube = cube.position.z != targetZoom;
            if (shouldZoomCube) {
                initialZoomDistance = cube.position.z;
                targetZoomDistance = targetZoom;
                zoomReachedCallback = animationComplete;
                beginAnimation();
            }
        }

        var rotateToEulerAngles = function(targetX, targetY, targetZ, animationComplete) {
            shouldRotateCube = cube.rotation.x != targetX || cube.rotation.y != targetY || cube.rotation.z != targetZ;
            if (shouldRotateCube) {
                initialRotationVector = new THREE.Vector3(cube.rotation.x, cube.rotation.y, cube.rotation.z);
                targetRotationVector = new THREE.Vector3(targetX, targetY, targetZ);
                rotationReachedCallback = animationComplete;
                beginAnimation();
            }
        }

        var incrementTextureCountOnTextureLoad = function() {
            loadedTexturesCount++;
            if (loadedTexturesCount == totalTexturesCount) {
                didFinishLoadingTextures();
            }
        }

        var showPanel = function(panelId) {
            currentPanelId = panelId;
            $(panelId).show();
        }

        var hideCurrentPanel = function() {
            $(currentPanelId).hide();
            currentPanelId = "";
        }

        /**
         * Fade the viewBox in while running the initial "spinning"
         * animation sequence. Bind user interaction callbacks here.
         */
        var didFinishLoadingTextures = function() {
            // Initial rendering sequence
            $("#viewBox").animate({ opacity: 1 }, 400);
            rotateToEulerAngles(forwardTiltAngle, initialRotationAmountY, 0, function() {
                $("#navigationPanel").animate({opacity: 0.7}, 200, function() {
                    for (var controlElementId in rotationAngles) {
                        $(controlElementId).hover(function(event) {
                            if (!isInZoomedMode) {
                                var elementId = "#" + event.target.id;
                                selectedFaceId = elementId;
                                var angles = rotationAngles[elementId];
                                rotateToEulerAngles(angles["hover"].x, angles["hover"].y, angles["hover"].z);
                                $(elementId).css({opacity: 1});
                            }
                        }, function(event) {
                            if (!isInZoomedMode) {
                                var elementId = "#" + event.target.id;
                                $(elementId).css({opacity: 0.7});
                            }
                        })
                        $(controlElementId).click(function(event) {
                            var elementId = "#" + event.target.id;
                            selectedFaceId = elementId;
                            $(elementId).css({opacity: 0.7});
                            var angles = rotationAngles[elementId];
                            rotateToEulerAngles(angles["zoomed"].x, angles["zoomed"].y, angles["zoomed"].z);
                            zoomToDistance(closeZDistance);
                            $("#viewBox").animate({opacity: 0.08}, 500);
                            var panelHeight = $("#navigationPanel").height();
                            $("#navigationControls").animate({opacity: 0}, 250);
                            $("#navigationControls").css({
                                "-webkit-transition": "0.25s ease-in-out",
                                "-webkit-transform": "translateY(" + panelHeight + "px)",
                            });
                            setTimeout(function() {
                                $("#zoomedControls").css({
                                    opacity: 1,
                                    "-webkit-transition": "0.25s ease-in-out",
                                    "-webkit-transform": "translateY(-" + (0.6 * panelHeight) + "px)",
                                });
                                $("#navigationControls").css({
                                    top: "100%",
                                    "-webkit-transition": "none",
                                    "-webkit-transform": "none",
                                });
                                setTimeout(function() {
                                    isInZoomedMode = true;
                                    if (selectedFaceId == "#about-control") {
                                        showPanel("#about-panel");
                                    } else if (selectedFaceId == "#projects-control") {
                                        showPanel("#projects-panel");
                                    } else if (selectedFaceId == "#resume-control") {
                                        showPanel("#resume-panel");
                                    } else if (selectedFaceId == "#contact-control") {
                                        showPanel("#contact-panel");
                                    }
                                    $("#zoomedControls").css({
                                        top: "40%",
                                        "-webkit-transition": "none",
                                        "-webkit-transform": "none",
                                    });
                                }, 250);
                            }, 250);
                        });
                    }
                    $("#back-control").hover(function() {
                        $("#back-control").css({opacity: 1});
                    }, function() {
                        $("#back-control").css({opacity: 0.7});
                    });
                    $("#back-control").click(function() {
                        zoomOutFromContentPanel();
                    });
                    window.onkeypress = function(event) {
                        // Either the ESC or DEL key was pressed.
                        if (event.charCode == 27 || event.charCode == 8) {
                            event.preventDefault();
                            zoomOutFromContentPanel();
                        }
                    }
                });
            });
        }

        var zoomOutFromContentPanel = function() {
            if (isCurrentlyZoomingOut || !isInZoomedMode)
                return;

            isCurrentlyZoomingOut = true;
            hideCurrentPanel();
            var angles = rotationAngles[selectedFaceId];
            rotateToEulerAngles(angles["hover"].x, angles["hover"].y, angles["hover"].z);
            zoomToDistance(farZDistance);
            $("#viewBox").animate({opacity: 1}, 500);
            var panelHeight = $("#navigationPanel").height();
            $("#zoomedControls").animate({opacity: 0}, 250);
            $("#zoomedControls").css({
                "-webkit-transition": "0.25s ease-in-out",
                "-webkit-transform": "translateY(" + (0.6 * panelHeight) + "px)"
            });
            setTimeout(function() {
                $("#navigationControls").css({
                    opacity: 1,
                    "-webkit-transition": "0.25s ease-in-out",
                    "-webkit-transform": "translateY(-" + panelHeight + "px)",
                });
                $("#zoomedControls").css({
                    top: "100%",
                    "-webkit-transition": "none",
                    "-webkit-transform": "none",
                });
                setTimeout(function() {
                    isInZoomedMode = false;
                    isCurrentlyZoomingOut = false;
                    $("#navigationControls").css({
                        top: "0%",
                        "-webkit-transition": "none",
                        "-webkit-transform": "none",
                    });
                }, 250);
            }, 250);
        }

        var faceMaterials = [
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_graph.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            }), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_projects.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            }), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_contact.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            }), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_resume.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            }), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_whsieh.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            }), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("textures/face_empty.png", null, incrementTextureCountOnTextureLoad),
                transparent: true
            })
        ];

        var cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshFaceMaterial(faceMaterials));
        scene.add(cube);
        var ambientLight = new THREE.AmbientLight(0xFFFFFF);
        scene.add(ambientLight);
        camera.position.z = 20;

        var beginAnimation = function() {
            if (isAnimationActive) {
               console.log("Animation already in progress!");
               return;
            }
            console.log("Beginning animation...");
            isAnimationActive = true;
            animate();
        }

        var endAnimation = function() {
            console.log("Ending animation...");
            isAnimationActive = false;
        }

        var updateZoom = function() {
            if (!shouldZoomCube) {
                if (!shouldRotateCube)
                    endAnimation();

                return;
            }
            if (abs(targetZoomDistance - cube.position.z) < 0.0025) {
                cube.position.z = targetZoomDistance;
                if (zoomReachedCallback)
                    zoomReachedCallback();

                shouldZoomCube = false;
                zoomReachedCallback = null;
            } else {
                cube.position.z += 0.15 * (targetZoomDistance - cube.position.z);
            }
        }

        var updateRotations = function() {
            if (!shouldRotateCube) {
                if (!shouldZoomCube)
                    endAnimation();

                return;
            }
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

        var renormalizeAngle = function(theta) {
            while (theta > PI)
                theta -= 2 * PI;

            while (theta < -PI)
                theta += 2 * PI;

            return theta;
        }

        var vector3AsString = function(v) {
            return "<" + v.x + "," + v.y + "," + v.z + ">";
        }

        var animate = function() {
            updateRotations();
            updateZoom();
            renderer.render(scene, camera);
            if (isAnimationActive)
                requestAnimationFrame(animate);
        }

        window.onresize = function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, 250);
});
