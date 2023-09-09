import catchAsyncError from '../utils/catch-async.js';
import User from '../models/user.js';

export const addToList = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { animeId } = req.params;
  const { listType } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $addToSet: { [listType]: animeId },
    },
    { new: true }
  );

  res.status(200).json({ updatedList: user[listType] });
});

export const removeFromList = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { animeId } = req.params;
  const { listType } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $pull: { [listType]: animeId },
    },
    { new: true }
  );

  res.status(200).json({ updatedList: user[listType] });
});
