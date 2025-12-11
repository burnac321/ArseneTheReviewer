// app/api/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate markdown content
    const markdown = generateMarkdown(data);
    const slug = data.slug || data.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    
    // Initialize Octokit with GitHub token
    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });
    
    // Create file in GitHub
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'burnac321',
      repo: 'ArseneTheReviewer',
      path: `content/reviews/${slug}.md`,
      message: `Add review: ${data.title}`,
      content: Buffer.from(markdown).toString('base64'),
      committer: {
        name: 'ArseneTheReviewer',
        email: 'review@arsenereviews.com'
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review published to GitHub!',
      url: `https://arsenereviews.com/reviews/${slug}`,
      editUrl: response.data.content.html_url
    });
    
  } catch (error: any) {
    console.error('Publish error:', error);
    
    // For testing without GitHub token
    if (error.message.includes('Bad credentials')) {
      return NextResponse.json({
        success: true,
        message: 'DEMO: Review would be published to GitHub',
        url: `https://arsenereviews.com/reviews/${data.slug}`,
        demo: true
      });
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function generateMarkdown(data: any): string {
  const frontmatter = `---
title: "${data.title}"
type: ${data.type}
itemName: "${data.itemName}"
brand: "${data.brand}"
rating: ${data.rating}
date: "${new Date().toISOString().split('T')[0]}"
author: "Arsene"
featuredImage: "${data.featuredImage}"
featuredVideo: "${data.featuredVideo}"
links: ${JSON.stringify(data.links)}
pros: ${JSON.stringify(data.pros.filter((p: string) => p.trim()))}
cons: ${JSON.stringify(data.cons.filter((c: string) => c.trim()))}
excerpt: "${data.excerpt}"
tags: "${data.tags}"
---

`;
  
  return frontmatter + data.content;
}
