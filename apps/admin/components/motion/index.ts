import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const MotionLink = motion.create(Link);
export const MotionButton = motion.create(Button);
