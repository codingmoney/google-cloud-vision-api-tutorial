// Import the Google Cloud Vision client library
const vision = require('@google-cloud/vision');

// Create a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'service-account-key.json', // Replace with the path to your service account key
});

// Function to analyze an image and determine if it's attractive to children
async function isAttractiveToChildren(imagePath) {
  try {
    // Perform label detection
    const [labelResult] = await client.labelDetection(imagePath);
    const labels = labelResult.labelAnnotations.map(label => label.description.toLowerCase());

    // Perform image properties detection
    const [propertiesResult] = await client.imageProperties(imagePath);
    const dominantColors = propertiesResult.imagePropertiesAnnotation.dominantColors.colors;

    // Check for child-attractive labels
    const childFriendlyLabels = ['toy', 'cartoon', 'game', 'animal', 'fun', 'colorful'];
    const hasChildFriendlyLabels = labels.some(label => childFriendlyLabels.includes(label));

    // Check for bright and vibrant colors
    const isColorful = dominantColors.some(color => color.score > 0.3 && color.pixelFraction > 0.2 && color.color);

    // Decide if the image is attractive to children
    if (hasChildFriendlyLabels || isColorful) {
      console.log('The image is likely attractive to children.');
      return true;
    } else {
      console.log('The image is not particularly attractive to children.');
      return false;
    }
  } catch (err) {
    console.error('Error analyzing image:', err);
    throw err;
  }
}

(async () => {
  const imagePath = 'https://designforceinc.com/wp-content/uploads/2019/09/toy-packaging-sustainability-equals-playability.jpg'; // Replace with your image file path
  const result = await isAttractiveToChildren(imagePath);
  console.log('Attractive to children:', result);
})();
