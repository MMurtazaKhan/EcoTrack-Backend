import Goal from "../models/goalModel.js";
import mongoose from "mongoose";
import Emission from "../models/emissionModel.js";
import asyncHandler from "express-async-handler";

// Create a new goal
export const addGoal = asyncHandler(async (req, res) => {
  try {
    const { category, percentage, target, startDate, endDate, goalAchieved } =
      req.body;
    let { userId } = req;

    const goal = await Goal.findOne({ userId: userId, category: category });
    if (goal) {
      console.log("it runs!!");
      return res.status(400).json({
        message: "Goal already exist in this category for this month",
      });
    }

    // Create new goal with previous emission data
    const newGoal = await Goal.create({
      userId,
      category,
      percentage,
      target,
      startDate,
      endDate,
      goalAchieved,
    });

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Weekly Goals Data
export const getWeeklyGoalsData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentGoals = await Goal.find({
      userId: id,
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json(recentGoals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const getWeeklyData = async (req, res) => {
  const userId = req.params.id;

  try {
    // Calculate date range for past 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Fetch goals set in the last 7 days
    const goals = await Goal.find({
      userId,
      createdAt: { $gte: sevenDaysAgo, $lte: today },
    });

    // Initialize an object to store emissions data
    const emissionsData = {};

    // Function to accumulate emissions data for a specific date range
    const accumulateEmissionsData = async (startDate, endDate, category) => {
      const emissions = await Emission.find({
        user: userId,
        category,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const totalEmissions = emissions.reduce((total, emission) => {
        return total + emission.carbonEmitted;
      }, 0);

      return totalEmissions;
    };

    // Iterate over each goal and accumulate emissions data
    for (const goal of goals) {
      const { category, percentage, startDate, endDate } = goal;

      // Calculate 7 days before startDate
      const sevenDaysBeforeStartDate = new Date(
        startDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );

      // Accumulate emissions data before startDate
      const emissionsBeforeStartDate = await accumulateEmissionsData(
        sevenDaysBeforeStartDate,
        startDate,
        category
      );

      // Accumulate emissions data between startDate and endDate
      const emissionsDuringGoalPeriod = await accumulateEmissionsData(
        startDate,
        endDate,
        category
      );

      // Store emissions data for the category
      if (!emissionsData[category]) {
        emissionsData[category] = {
          category,
          percentage,
          emissionsBeforeStartDate: 0,
          emissionsDuringGoalPeriod: 0,
        };
      }

      emissionsData[category].emissionsBeforeStartDate +=
        emissionsBeforeStartDate;
      emissionsData[category].emissionsDuringGoalPeriod +=
        emissionsDuringGoalPeriod;
    }

    // Convert emissionsData object to an array of values
    const result = Object.values(emissionsData);

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error fetching weekly goals data and accumulating emissions:",
      error
    );
    res.status(500).json({ error: "Server error" });
  }
};

// export const getMonthlyData = async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month

//     // Fetch active goals for the current month
//     const activeGoals = await Goal.find({
//       userId,
//       startDate: { $lte: today },
//       $or: [
//         { endDate: { $gte: today } },
//         { endDate: null }
//       ]
//     });

//     if (!activeGoals) {
//       console.log('No active goals found for user:', userId);
//       return res.status(404).json({ error: 'No active goals found' });
//     }

//     // Fetch targets for each active category for the current month
//     const targets = activeGoals.reduce((acc, goal) => {
//       acc[goal.category] = goal.target;
//       return acc;
//     }, {});

//     const emissionsData = {};

//     const accumulateEmissionsData = async (startDate, endDate, category) => {
//       const emissions = await Emission.find({
//         user: userId,
//         category,
//         createdAt: { $gte: startDate, $lte: endDate }
//       });

//       const totalEmissions = emissions.reduce((total, emission) => {
//         return total + emission.carbonEmitted;
//       }, 0);

//       return totalEmissions;
//     };

//     for (const goal of activeGoals) {
//       const { category, startDate, endDate } = goal;

//       // Calculate start and end dates for the emissions periods
//       const startOfPreviousMonth = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
//       const endOfNextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0); // Last day of the next month

//       // Accumulate emissions data
//       const emissionsBeforeGoalPeriod = await accumulateEmissionsData(startOfPreviousMonth, startOfMonth, category);
//       const emissionsDuringGoalPeriod = await accumulateEmissionsData(startOfMonth, endOfNextMonth, category);

//       emissionsData[category] = {
//         category,
//         percentage: goal.percentage,
//         target: targets[category],
//         emissionsBeforeGoalPeriod,
//         emissionsDuringGoalPeriod,
//         startDate,
//         endDate
//       };
//     }

//     const result = Object.values(emissionsData);

//     res.status(200).json(result);

//   } catch (error) {
//     console.error('Error fetching monthly goals data and accumulating emissions:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

export const getMonthlyData = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch all goals for the user
    const goals = await Goal.find({ userId });

    console.log("goals: ", goals);

    // Prepare the result array
    const result = [];

    for (const goal of goals) {
      const { category, percentage, target, startDate, endDate } = goal;

      // Calculate emissions before the goal period
      const emissionsBeforeGoalPeriod = await Emission.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            category,
            createdAt: { $lt: new Date(startDate) },
          },
        },
        {
          $group: {
            _id: null,
            totalEmissions: { $sum: "$carbonEmitted" },
          },
        },
      ]);

      // Calculate emissions during the goal period
      const emissionsDuringGoalPeriod = await Emission.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            category,
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalEmissions: { $sum: "$carbonEmitted" },
          },
        },
      ]);

      // Prepare the goal summary
      result.push({
        category,
        percentage,
        target,
        emissionsBeforeGoalPeriod:
          emissionsBeforeGoalPeriod[0]?.totalEmissions || 0,
        emissionsDuringGoalPeriod:
          emissionsDuringGoalPeriod[0]?.totalEmissions || 0,
        startDate,
        endDate,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all goals for a user
export const getGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ userId });
    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a goal by ID
export const getGoalById = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const goal = await Goal.findOne({ _id: req.params.id, userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    return res.status(200).json(goal);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a goal
export const updateGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const { goalStatus, dateWhenGoalCompleted } = req.body;
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId },
      { goalStatus, dateWhenGoalCompleted },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    return res.status(200).json(updatedGoal);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a goal
export const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const deletedGoal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    return res.status(204).json({ message: "Goal Deleted Successfully" }); // No content on successful deletion
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
