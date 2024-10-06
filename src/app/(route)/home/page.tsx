"use client"
import WithAuth from "@/utils/withAuth";
import { NextPage } from "next";

const HomePage: NextPage = () => {
    return (
       <div>hello</div> 
    )
};

// Check auth for this component if user not authenticated it will redirect to /login
export default WithAuth(HomePage);