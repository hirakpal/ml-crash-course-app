import { Lesson } from '../types/course';

export const REMOTE_COURSE_URL = 'https://developers.google.com/machine-learning/crash-course/llm';

export const CURRICULUM_SEED: Lesson[] = [
  {
    id: 'ml-foundations',
    moduleId: 'foundations',
    moduleTitle: 'Fundamentals of Machine Learning',
    title: 'From data to predictions',
    summary: 'Learn supervised learning, features, labels, and the iterative workflow that turns raw data into a useful model.',
    durationMinutes: 12,
    orderIndex: 1,
    prerequisiteLessonIds: [],
    visualizationIds: ['confusion-matrix', 'loss-curve'],
    sections: [
      {
        heading: 'What machine learning solves',
        body: 'Machine learning is useful when writing explicit rules would be brittle or impossible. Instead of hand-authoring behavior, you collect examples and optimize a model to generalize from them.',
        bullets: [
          'Features are the measurable inputs you feed into the model.',
          'Labels are the targets the model should predict.',
          'Generalization means performing well on data the model has never seen.'
        ]
      },
      {
        heading: 'A reliable training loop',
        body: 'A practical workflow cycles through collecting data, splitting datasets, training, evaluating, and iterating. Good models come from disciplined measurement rather than one-time tuning.',
        bullets: [
          'Use train / validation / test splits to avoid fooling yourself.',
          'Track baseline metrics before trying more complex architectures.',
          'Inspect errors to decide whether data, features, or the objective need adjustment.'
        ],
        codeExample: "const examples = dataset.map((row) => ({ features: row.inputs, label: row.output }));"
      },
      {
        heading: 'How to judge a model',
        body: 'Accuracy alone can hide failure cases. Precision, recall, and confusion matrices give a better picture when classes are imbalanced or mistakes have different costs.',
        bullets: [
          'Precision answers: when the model predicts positive, how often is it right?',
          'Recall answers: of the true positives available, how many were found?',
          'A confusion matrix surfaces false positives and false negatives directly.'
        ]
      }
    ],
    quiz: [
      {
        id: 'f1',
        prompt: 'What is the primary goal of a validation set?',
        options: ['Store production predictions', 'Tune the model without touching the final test set', 'Replace the training data', 'Increase model size'],
        answerIndex: 1,
        explanation: 'Validation data is used during iteration so that the held-out test set remains an unbiased final check.'
      },
      {
        id: 'f2',
        prompt: 'Which metric is most helpful when false negatives are costly?',
        options: ['Recall', 'Learning rate', 'Batch size', 'Epoch time'],
        answerIndex: 0,
        explanation: 'Recall highlights how many actual positives the model successfully captures.'
      },
      {
        id: 'f3',
        prompt: 'What are labels in supervised learning?',
        options: ['The model parameters', 'The expected outputs for each example', 'The visualization layer', 'The feature names only'],
        answerIndex: 1,
        explanation: 'Labels are the target values the model is trained to predict.'
      }
    ],
    resources: [
      { title: 'Google ML Crash Course overview', url: REMOTE_COURSE_URL, type: 'reading' }
    ]
  },
  {
    id: 'neural-networks',
    moduleId: 'deep-learning',
    moduleTitle: 'Neural Networks & Deep Learning',
    title: 'Why stacked layers work',
    summary: 'Explore neurons, hidden layers, nonlinear activations, and why depth helps models represent complex patterns.',
    durationMinutes: 14,
    orderIndex: 2,
    prerequisiteLessonIds: ['ml-foundations'],
    visualizationIds: ['neural-network-flow', 'activation-functions'],
    sections: [
      {
        heading: 'From linear models to neurons',
        body: 'A neuron computes a weighted sum of inputs, adds a bias term, and passes the result through an activation function. This gives the model the ability to capture nonlinear boundaries.',
        codeExample: 'z = w1 * x1 + w2 * x2 + b\na = relu(z)'
      },
      {
        heading: 'Hidden layers learn useful representations',
        body: 'Each hidden layer transforms the data into a representation that is easier for the next layer to use. Early layers often detect simple patterns, while deeper layers combine them into richer concepts.',
        bullets: [
          'Depth lets the network build hierarchical features.',
          'Wider layers can capture more parallel patterns.',
          'Too much capacity without enough data can overfit.'
        ]
      },
      {
        heading: 'Activations matter',
        body: 'ReLU is efficient and common in deep networks, Sigmoid compresses values into probabilities, and Tanh keeps outputs centered around zero.',
        bullets: [
          'ReLU: fast, sparse activations, but can die if always negative.',
          'Sigmoid: good for probabilities, but saturates at extremes.',
          'Tanh: symmetric around zero, often easier to optimize than Sigmoid.'
        ]
      }
    ],
    quiz: [
      {
        id: 'nn1',
        prompt: 'Why do neural networks need activation functions?',
        options: ['To add nonlinearity', 'To sort datasets', 'To reduce batch size', 'To replace weights'],
        answerIndex: 0,
        explanation: 'Without nonlinear activations, stacked layers collapse into a single linear transformation.'
      },
      {
        id: 'nn2',
        prompt: 'What does a hidden layer typically learn?',
        options: ['Only labels', 'Intermediate representations of the input', 'The final evaluation metric', 'Database indexes'],
        answerIndex: 1,
        explanation: 'Hidden layers extract internal features that make the next stage of prediction easier.'
      },
      {
        id: 'nn3',
        prompt: 'Which activation is most commonly used in modern deep networks?',
        options: ['Step function', 'ReLU', 'Softmax', 'Absolute value'],
        answerIndex: 1,
        explanation: 'ReLU is a common default because it is simple and usually trains well.'
      }
    ],
    resources: [
      { title: 'Google LLM course landing page', url: REMOTE_COURSE_URL, type: 'reading' }
    ]
  },
  {
    id: 'llm-architecture',
    moduleId: 'llms',
    moduleTitle: 'LLM Concepts and Architecture',
    title: 'Tokens, attention, and transformers',
    summary: 'Understand how large language models represent text, attend to context, and scale transformer blocks into powerful generative systems.',
    durationMinutes: 16,
    orderIndex: 3,
    prerequisiteLessonIds: ['neural-networks'],
    visualizationIds: ['neural-network-flow'],
    sections: [
      {
        heading: 'Language becomes tokens',
        body: 'LLMs process text as tokens rather than raw characters. Tokenization balances vocabulary size and flexibility so that unseen words can still be expressed as smaller units.'
      },
      {
        heading: 'Attention chooses what matters',
        body: 'Self-attention lets every token weigh the importance of every other token in the sequence. This is what allows transformers to capture long-range dependencies far better than many older sequence models.',
        bullets: [
          'Queries, keys, and values are learned projections of each token.',
          'Attention scores indicate how strongly one token should use information from another.',
          'Multi-head attention lets the model learn several relationship patterns at once.'
        ],
        codeExample: 'attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V'
      },
      {
        heading: 'Scaling the transformer',
        body: 'LLMs stack many transformer blocks, train on vast datasets, and often benefit from scaling laws: larger models with more data and compute tend to improve predictably up to practical limits.'
      }
    ],
    quiz: [
      {
        id: 'llm1',
        prompt: 'What is self-attention mainly used for?',
        options: ['Compressing images', 'Deciding which tokens should influence each other', 'Replacing embeddings', 'Sorting the vocabulary'],
        answerIndex: 1,
        explanation: 'Self-attention computes how much each token should use information from the rest of the sequence.'
      },
      {
        id: 'llm2',
        prompt: 'Why is tokenization important?',
        options: ['It removes all ambiguity from language', 'It maps text into units the model can process numerically', 'It prevents overfitting by itself', 'It guarantees factual outputs'],
        answerIndex: 1,
        explanation: 'Tokenization converts text into manageable discrete units for embeddings and sequence modeling.'
      },
      {
        id: 'llm3',
        prompt: 'What does multi-head attention enable?',
        options: ['More battery life', 'Multiple relationship patterns to be learned simultaneously', 'No need for training data', 'Elimination of embeddings'],
        answerIndex: 1,
        explanation: 'Different heads can specialize in different contextual relationships.'
      }
    ],
    resources: [
      { title: 'Google LLM concepts resource', url: REMOTE_COURSE_URL, type: 'reading' }
    ]
  },
  {
    id: 'training-optimization',
    moduleId: 'training',
    moduleTitle: 'Training and Optimization',
    title: 'Loss, gradients, and learning rate trade-offs',
    summary: 'See how optimization minimizes loss, why gradients matter, and how learning rate choices affect convergence and stability.',
    durationMinutes: 15,
    orderIndex: 4,
    prerequisiteLessonIds: ['llm-architecture'],
    visualizationIds: ['loss-curve', 'activation-functions'],
    sections: [
      {
        heading: 'Loss turns errors into a target',
        body: 'Training needs a scalar objective. A loss function measures how wrong a prediction is so optimization can move model weights in a better direction.'
      },
      {
        heading: 'Gradients point downhill',
        body: 'Backpropagation computes how each parameter influences loss. Gradient descent then nudges parameters in the negative gradient direction to reduce error.',
        codeExample: 'weight = weight - learningRate * gradient'
      },
      {
        heading: 'Learning rate is a balancing act',
        body: 'Too small a learning rate trains slowly, while too large a value overshoots the minimum and can destabilize training.',
        bullets: [
          'Schedules and warmups help training remain stable.',
          'Normalization and adaptive optimizers can improve convergence.',
          'Monitoring loss curves reveals underfitting, overfitting, and divergence.'
        ]
      }
    ],
    quiz: [
      {
        id: 'opt1',
        prompt: 'What does the gradient tell you?',
        options: ['How to label the data', 'How loss changes as a parameter changes', 'How many layers to add', 'Which tokenizer to use'],
        answerIndex: 1,
        explanation: 'The gradient measures sensitivity of the loss to each parameter and indicates a descent direction.'
      },
      {
        id: 'opt2',
        prompt: 'What is a common sign that the learning rate is too high?',
        options: ['Loss oscillates or explodes', 'Training becomes free', 'The model uses fewer tokens', 'Precision always increases'],
        answerIndex: 0,
        explanation: 'Oversized steps can bounce around the minimum or diverge entirely.'
      },
      {
        id: 'opt3',
        prompt: 'Why do we need a loss function?',
        options: ['To choose device orientation', 'To give optimization a numerical target to minimize', 'To draw charts only', 'To store lessons offline'],
        answerIndex: 1,
        explanation: 'Loss quantifies model error so optimization has a concrete goal.'
      }
    ],
    resources: [
      { title: 'Google training overview', url: REMOTE_COURSE_URL, type: 'reading' }
    ]
  },
  {
    id: 'practical-applications',
    moduleId: 'applications',
    moduleTitle: 'Practical Applications',
    title: 'Evaluate, prompt, and deploy responsibly',
    summary: 'Wrap the course up with real-world evaluation, prompt design, safety trade-offs, and production thinking for ML-powered products.',
    durationMinutes: 13,
    orderIndex: 5,
    prerequisiteLessonIds: ['training-optimization'],
    visualizationIds: ['confusion-matrix'],
    sections: [
      {
        heading: 'Evaluation must match the product',
        body: 'A useful ML system is measured by the outcomes it enables. Offline metrics are helpful, but production success usually requires task-specific evaluation, latency targets, and human review loops.'
      },
      {
        heading: 'Prompting and grounding',
        body: 'LLM applications often improve when prompts clearly define the task, provide examples, and ground responses in retrieved or trusted context.'
      },
      {
        heading: 'Safety and iteration',
        body: 'Real deployments need monitoring for hallucinations, bias, and misuse. Instrumentation, user feedback, and targeted evaluations help teams ship responsibly and improve over time.',
        bullets: [
          'Choose safeguards that match the domain risk.',
          'Keep humans in the loop for high-stakes decisions.',
          'Track regressions as models, prompts, and data evolve.'
        ]
      }
    ],
    quiz: [
      {
        id: 'app1',
        prompt: 'What usually improves LLM reliability in an application?',
        options: ['Grounding responses in trusted context', 'Removing all evaluation', 'Using only one metric forever', 'Avoiding user feedback'],
        answerIndex: 0,
        explanation: 'Grounding and retrieval reduce unsupported answers by giving the model concrete context.'
      },
      {
        id: 'app2',
        prompt: 'Why are production metrics important?',
        options: ['They show whether the system helps real users under real constraints', 'They replace training data', 'They eliminate safety work', 'They guarantee perfect accuracy'],
        answerIndex: 0,
        explanation: 'Production metrics connect model quality to user and business outcomes.'
      },
      {
        id: 'app3',
        prompt: 'What is a good practice for high-stakes ML use cases?',
        options: ['Skip monitoring', 'Keep humans in the loop', 'Ignore edge cases', 'Increase randomness'],
        answerIndex: 1,
        explanation: 'Human review is an important safeguard where errors could cause material harm.'
      }
    ],
    resources: [
      { title: 'Google LLM applications resource', url: REMOTE_COURSE_URL, type: 'reading' }
    ]
  }
];
