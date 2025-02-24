import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tenant name is required'],
      trim: true,
      maxlength: [100, 'Tenant name cannot exceed 100 characters']
    },
    code: {
      type: String,
      required: [true, 'Tenant code is required'],
      unique: true,
      trim: true,
      maxlength: [20, 'Tenant code cannot exceed 20 characters']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  export default mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);