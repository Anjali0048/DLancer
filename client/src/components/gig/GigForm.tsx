import React from "react";
import { DollarSign, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCreateGigMutation } from "@/features/gig/gigAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { resetGigData, setGigData } from "@/features/gig/gigSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function GigForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const gigData = useSelector((state: RootState) => state.gig);
  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress) || "";

  const [createGig, { isError, isSuccess }] = useCreateGigMutation();

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setGigData({ 
      ...gigData.gig,
      walletAddress,
      [name]: name === "features" ? value.split(",").map((item) => item.trim()) : value 
    }));
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));

    dispatch(setGigData({
      ...gigData.gig,
      images: [...(gigData.gig.images || []), ...filesArray],
    }));

    // Cleanup object URLs to avoid memory leaks
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGig(gigData.gig).unwrap();
      toast.success("Successfully posted gig!", {position: "top-center"});
      dispatch(resetGigData());
      setTimeout(() => navigate('/client-dashboard'), 3000);
    } catch (error) {
      console.error("Error creating gig:", error);
    }
  };

  return (
    <div className="flex items-center h-full justify-center overflow-auto">
      <Card className="p-6">
        <ToastContainer aria-label={undefined} />
        <form className="space-y-6">
          <div>
            <Label>Project Title</Label>
            <Input type="text" name="title" value={gigData.gig.title} onChange={handleChange} placeholder="e.g., Mobile App Development" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={gigData.gig.description} name="description" onChange={handleChange} rows={4} placeholder="Describe your project requirements..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={gigData.gig.category} name="category" onValueChange={(value) => dispatch(setGigData({ ...gigData.gig, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent> 
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gig Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input value={gigData.gig.price} name="price" onChange={handleChange} type="number" className="pl-10 [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none" placeholder="Enter amount" />
              </div>
            </div>
          </div>

          <div>
            <Label>Required Skills</Label>
            <Input value={gigData.gig.features} name="features" onChange={handleChange} type="text" placeholder="e.g., React, Node.js, TypeScript" />
          </div>

          <div>
            <Label>Project Deadline</Label>
            <Input className="[&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none" placeholder="Enter the deadline" value={gigData.gig.deliveryTime} name="deliveryTime" onChange={handleChange} type="number" />
          </div>

          {/* Image Upload Section */}
          <div>
            <Label>Upload Images</Label>
            <div className="flex items-center space-x-2">
              <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 border rounded-lg shadow-sm hover:bg-gray-200">
                <Upload className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-sm text-gray-700">Choose Images</span>
              </label>
            </div>
            {/* Image Preview */}
            {gigData.gig.images && gigData.gig.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {gigData.gig.images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img src={image} alt={`Uploaded ${index}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Post Project
          </Button>

          {isSuccess && <p className="text-green-600">Gig created successfully!</p>}
          {isError && <p className="text-red-600">Error creating gig.</p>}
        </form>
      </Card>
    </div>
  );
}
