
import { addCategoryy, addCountry } from "./controllers/commonController";
import connectDB from "./dbConnection/db";


// Connect to the database
connectDB();
(async () => {
    try {
        await addCategoryy();
        await addCountry();

        console.log('Initialization completed successfully.');


        process.exit(0); // Exit the script with success status
    } catch (error) {
        console.error('Initialization failed. Error:', error);
        process.exit(1); // Exit the script with an error status
    }
})();