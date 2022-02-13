# Cubing Website

Cubing website is a website for cubing

# Overview

- This is a Cubing Website that lets you learn the algorithms you don't know, practice the ones you suck at, and track your improvement. It uses React for the front and Firebase for everything else (auth, hosting, database).

# Contributing

## Basics

- All contributions should be made via pull requests to the `main` branch, commits cannot be made directly to this branch
- A GitHub Action automatically deploys each PR to a [Firebase Preview Channel](https://firebase.google.com/docs/hosting/manage-hosting-resources)
- Once this has been merged, the `main` branch is automatically deployed to [cubingwebsite.com](https://cubingwebsite.com/)

## File Structure

- inside the src folder there are `components`, `hooks`, `utils`, `data` and a few other things
- `components` are all the react components, everything from the train page to the confirmation modals
- `hooks` is where all the custom React hooks live
- `utils` is where the slightly more intelligent code lives. This contains the functions that figure out which case to show you next as well as those that calculate your session statistics.
- `data` is my temporary place to put static data that the website uses. This is mostly "Case Set" files.

## Terminology

### State

The state the cube is in; where all the peices are.

### Algorithm

Something like this `R U R' U'` that tells you how to turn certan faces of a cube. "Alg" is short of algorithm.

### Scramble

An algorithm used to scramble the cube. Normally a scramble is used to get the cube into a random state, but it can also be used to get the cube into a random group of states

### Case

I had a formal definition for a case but I have since forgotten it. I _think_ it was a state that has a known "solved" state. The important thing is that you know the difference between a case and an algorithm, a case is the **problem** and an algorithm is the **solution**. A given case can be solved with various different algorithms, and a given algorithm may solve various different cases.

### Case Set

A case set is a group of cases with a shared initial state and solved state. You may have heard of these being called "alg sets" but this name is innacurate since the same "alg set" can contain different algorithms for different people, it is the cases that are common and thus it is a set of cases. PLL and OLL are examples of case sets.

### Solve

A solve the name for what you did when you solved the cube or a certain case. The most important part of a solve is how long you took to solve it, this is called the **duration** of the solve. We may also want to record when the solve happened, what the initial state was, if any penalties were incurred, etc.

### Duration

Duration is just how long something took, normally a solve. If the thing was started and never finished, then the duration is infinity. Durations are the most important field to record on a solve.

### Session

A session is a collection of solves that happened around the same time (normally on the same day).

---

There are other terms that may be important to list here, but this will do for now.
