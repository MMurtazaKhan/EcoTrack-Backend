


// Create an object with corresponding carbon footprint values per kg
const carbonFootprintData = {
    wheat: 1.4,
    maize: 1.1,
    barley: 1.1,
    oatmeal: 1.6,
    rice: 4,
    potatoes: 0.3,
    cassava: 0.9,
    caneSugar: 2.6,
    beetSugar: 1.4,
    otherPulses: 1.6,
    peas: 0.8,
    nuts: 0.2,
    groundnuts: 2.4,
    soymilk: 1,
    tofu: 3,
    soybeanOil: 6,
    palmOil: 7.6,
    sunflowerOil: 3.5,
    rapeseedOil: 3.7,
    oliveOil: 6,
    tomatoes: 1.4,
    onionsAndLeeks: 0.3,
    rootVegetables: 0.3,
    brassicas: 0.4,
    otherVegetables: 0.5,
    citrusFruit: 0.3,
    bananas: 0.8,
    apples: 0.3,
    berriesAndGrapes: 1.1,
    wine: 1.4,
    otherFruit: 0.7,
    coffee: 16.5,
    darkChocolate: 18.7,
    beefBeefHerd: 59.6,
    beefDairyHerd: 21.1,
    lambAndMutton: 24.5,
    pigMeat: 7.2,
    poultryMeat: 6.1,
    milk: 2.8,
    cheese: 21.2,
    eggs: 4.5,
    fishFarmed: 5.1,
    shrimpsFarmed: 11.8
};


const getCarbonFootprint = (req, res) => {
    const { food, kg } = req.body;

    // Check if the food item exists in the carbonFootprintData
    if (!(food.toLowerCase() in carbonFootprintData)) {
        return res.status(404).json({ error: 'Food item not found' });
    }

    // Calculate the carbon footprint based on the given kg
    const carbonFootprintPerKg = carbonFootprintData[food.toLowerCase()];
    const totalCarbonFootprint = carbonFootprintPerKg * parseFloat(kg);

    const roundedCarbonFootprint = parseFloat(totalCarbonFootprint.toFixed(3));

    // Send the total carbon footprint as the response
    res.json({ carbonFootprint: roundedCarbonFootprint });
};

// Export the API endpoint handler
export {getCarbonFootprint}
