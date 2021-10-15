"use-strict";
window.addEventListener('DOMContentLoaded', loadBagSVG);

let selectedColor = "transparent";
const features = {
    keychain: false,
    pin: false,
    object: false,
};
const selectedList = document.getElementById("selectedList");

function loadBagSVG() {
    fetch("assets/bag-01.svg")
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        document.getElementById("handbag").innerHTML = data;
        document.getElementById("body").classList.add("g_to_interact_with");
        document.getElementById("rectangle").classList.add("g_to_interact_with");
        document.getElementById("handle").classList.add("g_to_interact_with");
        document.getElementById("triangles").classList.add("g_to_interact_with");
        loadFeaturesSVG();
    })
}

function loadFeaturesSVG() {
    fetch("assets/features.svg")
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        document.getElementById("features").innerHTML = data;
        document.getElementById("ribbon").classList.add("feature");
        document.getElementById("ribbon").classList.add("hide");
        document.getElementById("ribbon").classList.add("g_to_interact_with");
        document.getElementById("flower").classList.add("feature");
        document.getElementById("flower").classList.add("hide");
        document.getElementById("flower").classList.add("g_to_interact_with");
        document.getElementById("keychain").classList.add("feature");
        document.getElementById("keychain").classList.add("hide");
        document.getElementById("keychain").classList.add("g_to_interact_with");
        document.getElementById("tassel").classList.add("feature");
        document.getElementById("tassel").classList.add("hide");
        document.getElementById("tassel").classList.add("g_to_interact_with");
        document.getElementById("butterfly").classList.add("feature");
        document.getElementById("butterfly").classList.add("hide");
        document.getElementById("butterfly").classList.add("g_to_interact_with");
        start();
    })
} 

function start() {
    document.querySelectorAll(".g_to_interact_with").forEach(selectBagPart);
    resetPreview();

    document.querySelectorAll(".item").forEach(function(item) {
        item.addEventListener('click', function(event) {
            handleFeatures(event);
        });
    });

    document.querySelectorAll(".color").forEach(selectColor);
    addNewColor();
}

function resetPreview() {
    document.getElementById("reset").addEventListener('click', function() {
        if (selectedList.getElementsByTagName("li").length > 0) {
            for(let i=0; i<=selectedList.getElementsByTagName("li").length; i++) {
                selectedList.removeChild(selectedList.firstChild);
            }
        }
        document.querySelectorAll(".feature").forEach(function(feature) {
            feature.classList.add("hide");
        });
        document.querySelectorAll(".item").forEach(function(feature) {
            feature.classList.remove("chosenItem");
        });
        document.querySelectorAll(".g_to_interact_with").forEach(function(element) {
            element.querySelectorAll('*').forEach(function(e) {
                e.setAttribute("fill", "transparent");
            });
        });
        selectedColor = "transparent";
        document.querySelectorAll(".color").forEach(function(e) {
            e.classList.remove("chosenColor");
        });
    });
}

/**
 * CHANGING COLORS
 */

function selectBagPart(element) {
    hovering(element);
    element.addEventListener('click', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.setAttribute("fill", selectedColor);
        });
    });
}

function hovering(element) {
    element.addEventListener('mouseover', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.add("over");
        });
    });
    element.addEventListener('mouseout', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.remove("over");
        });
    });
}

/**
 * SELECT COLORS
 */

function selectColor(element) {
    element.addEventListener('click', function() {
        selectedColor = element.style.backgroundColor;
        document.querySelectorAll(".color").forEach(function(e) {
            e.classList.remove("chosenColor");
        });
        element.classList.add("chosenColor");
    });
}

function addNewColor() {
    document.getElementById("addColor").addEventListener('click', function() {
        let text = prompt("Please enter a valid hex code (ex.: #ffffff):", "#ffffff");
        if (text == null || text == "" || text.length != 7) {
            console.log("no color detected");
        } else {
            const newColor = document.createElement("div");
            newColor.classList.add("color");
            newColor.style.backgroundColor = text;
            
            const colorCode = document.createElement("label");
            colorCode.innerHTML = text;
            newColor.append(colorCode);
            
            selectColor(newColor);
            document.getElementById("addColor").parentNode.insertBefore(newColor,  document.getElementById("addColor").nextSibling);
        }
    });
}


/**
 * CHANGING FEATURES
 */

function handleFeatures(event) {
    const target = event.currentTarget;
    const feature = target.dataset.feature;

    const add = restrictions(feature);
    if (!features[feature]) {
        if (add) {
            addFeature(feature);
        }
    }else {
        deleteFeature(feature);
    }
}


function restrictions(feature) {
    let add = false;

    if (feature === "keychain") {
        if (!features["tassel"]) {
            add = true;
        }
    }
    if (feature === "tassel") {
        if (!features["keychain"]) {
            add = true;
        }
    }
    if (feature === "ribbon") {
        if (!features["butterfly"] && !features["flower"]) {
            add = true;
        }
    }
    if (feature === "butterfly") {
        if (!features["ribbon"] && !features["flower"]) {
            add = true;
        }
    }
    if (feature === "flower") {
        if (!features["ribbon"] && !features["butterfly"]) {
            add = true;
        }
    }

    return add;
}

function addFeature(feature) {
    features[feature] = true;
    console.log("feature");
    document.getElementById(feature).classList.remove("hide");
    document.getElementById("text_"+feature).classList.add("chosenItem");
    selectedList.appendChild(createFeatureElement(feature));
    animationIn(feature);
}

function deleteFeature(feature) {
    features[feature] = false;
    document.getElementById("text_"+feature).classList.remove("chosenItem");
    document.getElementById(feature).classList.add("hide");
    animationOut(feature);
    setTimeout(function() {
        selectedList.removeChild(document.getElementById("selected_"+feature));
    }, 1000);
}

function createFeatureElement(feature) {
    const li = document.createElement("li");
    li.id = "selected_" + feature;

    const img = document.createElement("img");
    img.src = `assets/feature_${feature}.png`;

    li.append(img);
    return li;
}

function animationIn(feature) {
    const firstFrame = document.getElementById("item_"+feature).getBoundingClientRect();
    const lastFrame = document.getElementById("selected_"+feature).getBoundingClientRect();
    const deltaX = firstFrame.left - lastFrame.left;
    const deltaY = firstFrame.top - lastFrame.top;
    const deltaWidth = firstFrame.width / lastFrame.width;
    const deltaHeight = firstFrame.height / lastFrame.height;
    document.getElementById("selected_"+feature).animate(
      [
        {transformOrigin: "top left",
          transform: `translate(${deltaX}px, ${deltaY}px)
          scale(${deltaWidth}, ${deltaHeight})`
        },
        {transformOrigin: "top left",
          transform: 'none'
        }
      ],
      {duration:1000, easing: "ease-in", fill:"forwards"}
    );
}

function animationOut(feature) {
    const firstFrame = document.getElementById("selected_"+feature).getBoundingClientRect();
    const lastFrame = document.getElementById("item_"+feature).getBoundingClientRect();
    const deltaX = lastFrame.left - firstFrame.left;
    const deltaY = lastFrame.top - firstFrame.top;                                            
    const deltaWidth = lastFrame.width / firstFrame.width;
    const deltaHeight =  lastFrame.height  / firstFrame.height;
    document.getElementById("selected_"+feature).animate(
        [
            {transformOrigin: "top left",
                transform: 'none'
            },
            {transformOrigin: "top left",
                transform: `translate(${deltaX}px, ${deltaY}px)
                scale(${deltaWidth}, ${deltaHeight})`
            }
        ],
        {duration:1000, easing: "ease-out"}
    );
}

