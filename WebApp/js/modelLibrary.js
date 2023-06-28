let ModelLibrary;
let CurrentModel = 0;

async function main() {
  try {
    const csvResults = await getCSVData();
    ModelLibrary = csvResults.data;
    DisplayModel(CurrentModel);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to retrieve CSV data as a string
function getCSVData() {
  return new Promise((resolve, reject) => {
    $.get("data/ModelLibrary.csv", function (csvString) {
      Papa.parse(csvString, {
        delimiter: ",",
        header: true,
        dynamicTyping: true,
        newline: "", // auto-detect
        complete: function (results) {
          // Access and process the parsed data here
          resolve(results);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  });
}

// Function to display the model
function DisplayModel(modelId) {
  // Display logic goes here
  // Function to load a model from a library, given a library and a model ID
  function loadModel(modelId) {
    // Create the iframe element
    const iframe = document.createElement("iframe");

    // Set attributes for the iframe
    iframe.id = "model";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.mozallowfullscreen = true;
    iframe.webkitallowfullscreen = true;
    iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
    iframe.setAttribute("xr-spatial-tracking", true);
    iframe.setAttribute("execution-while-out-of-viewport", true);
    iframe.setAttribute("execution-while-not-rendered", true);
    iframe.setAttribute("web-share", true);

    // Set the source URL dynamically
    const sourceUrl = ModelLibrary[modelId].Source;
    //"https://sketchfab.com/models/2f687b6a629143dbbdf7417cdf93dd8b/embed";
    iframe.src = sourceUrl;

    const title = ModelLibrary[modelId].Name; //"Your Custom Title";
    iframe.title = title;

    return iframe;
  }

  let modelFrame = loadModel(modelId);
  document.getElementById("sketchfab-embed-wrapper").innerHTML = "";
  document.getElementById("sketchfab-embed-wrapper").appendChild(modelFrame);
}

// Call the main function
main();

// Function to show next model based on a jquery event on #nextModel
$("#nextModel").click(function () {
  CurrentModel++;
  if (CurrentModel >= ModelLibrary.length) {
    CurrentModel = 0;
  }
  DisplayModel(CurrentModel);
});

// Function to show previous model based on a jquery event on #prevModel
$("#prevModel").click(function () {
  CurrentModel--;
  if (CurrentModel < 0) {
    CurrentModel = ModelLibrary.length - 1;
  }
  DisplayModel(CurrentModel);
});

// Function to open new tab to the relavent wiki page
$("#wikiInfo").click(function () {
  console.log(ModelLibrary[CurrentModel])
  let externalLink = ModelLibrary[CurrentModel].Wiki;
  
  // Check if the link starts with "http://" or "https://"
  if (!externalLink.startsWith("http://") && !externalLink.startsWith("https://")) {
    // If it doesn't start with "http://" or "https://", prepend it with "https://" to make it an absolute URL
    externalLink = "https://" + externalLink;
  }
  
  window.open(externalLink);
});
