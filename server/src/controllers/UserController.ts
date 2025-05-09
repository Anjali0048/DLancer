import { Request, Response } from 'express';
import User, { IUser } from '../models/Users';
import Freelancer from '../models/FreelancerSchema';
import Client from '../models/ClientSchema';
import jwt from "jsonwebtoken"

const SECRET_KEY: string = process.env.SECRET_KEY || " "

// Route to authenticate a user
export const authenticate = async (req: Request, res: Response): Promise<any | undefined> => {
  const { walletAddress, role } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    let user: IUser | null = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, role });
      await user.save();
      
    const token = jwt.sign({ walletAddress, role }, SECRET_KEY, {
      expiresIn: "120h",
    });
    // console.log("token: ", token)
  
    res.cookie("authtoken", token, {
      httpOnly: true,   
      signed:true,
      maxAge: 5 * 24 * 60 * 60 * 1000, 
    });

      return res.status(201).json({ message: 'User registered', user });
    }
    

    res.status(200).json({ message: 'User authenticated', user });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


export const createFreelancerProfile = async (req: Request, res: Response): Promise<any | undefined> => {
  const { walletAddress, freelancerName, skills, portfolio, hourlyRate, availability } = req.body;

  try {
    // Fetch user
    const user = await User.findOne({ walletAddress });
    if (!user || user.role !== 'freelancer') {
      return res.status(400).json({ message: 'Invalid freelancer profile request' });
    }

    // Create freelancer profile
    const freelancerProfile = await Freelancer.create({
      walletAddress,
      freelancerName,
      skills,
      portfolio,
      hourlyRate,
      availability,
    });

    res.status(201).json({ message: 'Freelancer profile created successfully', profile: freelancerProfile });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const createClientProfile = async (req: Request, res: Response): Promise<any | undefined> => {
  const { walletAddress, clientName, companyName, projectsPosted, paymentHistory } = req.body;

  try {
    // Fetch user
    const user = await User.findOne({ walletAddress });
    if (!user || user.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client profile request' });
    }

    // Create client profile
    const clientProfile = await Client.create({
      walletAddress,
      clientName,
      companyName,
      projectsPosted,
      paymentHistory,
    });

    res.status(201).json({ message: 'Client profile created successfully', profile: clientProfile });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
