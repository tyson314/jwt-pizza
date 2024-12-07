# Curiosity Report: AI DevOps Tools

The main thing I learned in this course is to avoid toil at all cost. If you find yourself doing something more than once, you can likely find a way to automate said task using some DevOps workflow. I have seen AI reduce toil in other areas of software engineering (i.e. autocomplete, no more dives into stack overflow, etc.), so I wanted to investigate the possibility of AI reducing the toil of deploying and mantaining software. I looked into several different tools on the market. I will describe them below, along with a short opinion on whether or not I think that they are necessary.

### Amazon Code Guru

Amazon Code Guru is a tool developed by Amazon to look through your codebase to help improve it's quality. You can think of it as another QA engineer. One of its strengths includes scanning code for unintended security vulnerabilities. It is often difficult to forsee how cracks in your systems can be exploited, so Code Guru's objective, comprehensive analysis can catch these issues early. I would definitely say that it is not a replacement for writing good tests using like we did in class. This AI (for now) can only look at the code, it can't poke and prod at it to see if its fuctionality and error handling is that what it needs to be in a variety of business cases.

### Datadog

Datadog is a very cool tool to use with observability and recovery. It is an application that works within a cloud deployment. Datadog can compile sources of critical data into a single dashboard, and it can interpret metrics to see which ones are important to be looking at in certain situations. It also takes a stap at interpretting logs and metrics in order to determine the root causes of system failures. Another cool thing I saw about Datadog is that Grafana has a built in Dashboard that specifically supports Datadog. It is still essential for engineers to create logging systems, but Datadog is a great tool to use with them.

### Sysdig

Sysdig is another AI tool that can assist with security in the cloud. It specializes in rapid, real time threat detection for large scale cloud deployed applications. This is essential because every minute counts in a security breach situation. It combines container visibility, packet inspection, and kubernetes monitoring to do this. Recently, this toolage was combined with an LLM to assist with interpretting results from Sysdig. Honestly, sysdig doesn't scream innovative when it comes to AI, but it was cool to read about a top security tool such as this one.

### PagerDuty

From what I was able to understand, Pagerduty is like Grafana OnCall on steroids. It provides reliable alerting and monitoring for DevOps teams of any size. Some of the cool innovations that Pagerduty employs is it's use of LLMs to interpret alerts, and form incident write-ups. It can also handle minor, mundane tasks that come from failure recovery. Other than that, I would say it's functionality is nearly identical to Grafana OnCall

### Conclusion

After all this reading into AI tools in DevOps, nothing really blew me away as ground breaking. I understand better why Grafana was chosen as one of our main DevOps tools because it is pretty much capable of doing a lot of the above programs jobs with the proper configurations. Amazon CodeGuru was the most different than any of the technologies that we talked about in class. I would say this is one would be the best at reducing toil since it can uncover things that would take hours of searching for. It would also be good for onboarding new engineers. On that same note, Pagernotes' alert analysis could remove toil of scouring the code base in that same way.