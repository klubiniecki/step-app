-- Sample Activities for Small Steps MVP

-- Activities for ages 4-6
INSERT INTO activities (title, description, instructions, age_min, age_max, duration_minutes, materials_needed, category, difficulty_level) VALUES
('Magic Mirror Time', 'Look in the mirror together and make funny faces, then talk about what you see.', 'Stand in front of a mirror with your child. Take turns making different facial expressions - happy, sad, surprised, silly. Ask your child to copy you, then let them lead. Talk about what each expression means and when we might feel that way.', 4, 6, 5, '{"mirror"}', 'emotional', 1),

('Color Hunt Adventure', 'Find objects around the house that match specific colors.', 'Pick a color and challenge your child to find 5 things in the house that are that color. Take turns picking colors. Make it exciting by pretending to be explorers on a treasure hunt!', 4, 6, 10, '{}', 'educational', 1),

('Dance Party Freeze', 'Dance to music and freeze when it stops.', 'Play upbeat music and dance together. When you pause the music, everyone must freeze in whatever position they''re in. Take turns being the "DJ" who controls the music. Laugh at the silly frozen positions!', 4, 6, 8, '{"music player"}', 'physical', 1),

('Story Building', 'Create a story together, taking turns adding one sentence.', 'Start with "Once upon a time..." and add one sentence. Then your child adds the next sentence. Keep going back and forth, building a silly or adventurous story together. Let your imaginations run wild!', 4, 6, 12, '{}', 'creative', 2),

('Animal Charades', 'Act out different animals and guess what they are.', 'Take turns acting out different animals without making sounds. The other person has to guess what animal you''re pretending to be. Start with easy ones like cats, dogs, elephants, then try more challenging ones!', 4, 6, 10, '{}', 'physical', 2);

-- Activities for ages 7-8
INSERT INTO activities (title, description, instructions, age_min, age_max, duration_minutes, materials_needed, category, difficulty_level) VALUES
('Gratitude Scavenger Hunt', 'Find things around the house that you''re grateful for.', 'Walk around your home together and find 10 things you''re grateful for. It could be a favorite toy, a cozy blanket, or even running water. Take turns sharing why each item makes you feel grateful.', 7, 8, 12, '{}', 'emotional', 1),

('Kitchen Science Experiment', 'Make a simple volcano with baking soda and vinegar.', 'In a small container, mix baking soda with a few drops of food coloring. Add vinegar and watch the "lava" bubble up! Talk about what''s happening and why. Try different colors and amounts.', 7, 8, 15, '{"baking soda", "vinegar", "food coloring", "small container"}', 'educational', 2),

('Memory Palace', 'Create a mental map of your house with special memories.', 'Walk through your house together and assign a special memory to each room. "This is where we had that amazing breakfast" or "This is where we read that funny book." Then try to recall all the memories by walking through the house again.', 7, 8, 10, '{}', 'educational', 2),

('Compliment Circle', 'Take turns giving each other genuine compliments.', 'Sit facing each other and take turns giving compliments. They can be about personality, things they''ve done, or things you appreciate about them. Make sure each compliment is specific and heartfelt.', 7, 8, 8, '{}', 'emotional', 1),

('Future Self Interview', 'Interview each other as if you''re talking to your future self.', 'Take turns being the interviewer and the "future self." Ask questions like "What''s your favorite thing about being older?" or "What advice would you give to kids my age?" Be creative and have fun with the answers!', 7, 8, 12, '{}', 'creative', 3);

-- Activities for ages 9-10
INSERT INTO activities (title, description, instructions, age_min, age_max, duration_minutes, materials_needed, category, difficulty_level) VALUES
('Problem-Solving Challenge', 'Work together to solve a real family problem or decision.', 'Pick a small family decision that needs to be made (like what to have for dinner this week or how to organize a room). Brainstorm solutions together, write down pros and cons, and make a decision as a team.', 9, 10, 15, '{"paper", "pen"}', 'social', 3),

('Dream Vacation Planning', 'Plan an imaginary vacation together with a budget.', 'Give your child a pretend budget (like $1000) and plan a dream vacation. Research destinations, activities, and costs. Make it realistic but fun - where would you go? What would you do? How would you spend the money?', 9, 10, 15, '{"paper", "pen", "internet access"}', 'educational', 2),

('Emotion Detective', 'Practice identifying and discussing emotions in different scenarios.', 'Create cards with different scenarios (like "someone took your favorite pencil" or "you got a great grade"). Take turns picking cards and discussing what emotions you might feel and why. Talk about healthy ways to handle each emotion.', 9, 10, 12, '{"scenario cards"}', 'emotional', 2),

('Family Time Capsule', 'Create a time capsule with current memories and predictions.', 'Find a small box and fill it with items that represent your family right now - photos, drawings, notes about current interests, predictions about the future. Bury it or hide it to open in a year!', 9, 10, 15, '{"small box", "paper", "pens", "photos"}', 'creative', 2),

('Mindful Breathing Together', 'Practice different breathing exercises and discuss how they make you feel.', 'Try different breathing patterns together - 4 counts in, 4 counts out; box breathing; or belly breathing. After each one, discuss how it made you feel. This is great for stress relief and connection.', 9, 10, 8, '{}', 'emotional', 1);

-- Sample Parenting Insights
INSERT INTO insights (title, content, category, age_range) VALUES
('The Power of 15 Minutes', 'Even just 15 minutes of focused, undivided attention can make a huge difference in your child''s day. Put away your phone, make eye contact, and really listen. This small investment pays dividends in your relationship.', 'bonding', 'all'),

('Why Kids Need to Feel Heard', 'When children feel truly heard and understood, they''re more likely to cooperate and share their feelings. Try reflecting back what they say: "It sounds like you''re feeling frustrated because..." This validates their emotions.', 'communication', 'all'),

('The Magic of Play', 'Play is how children process their world and emotions. When you join their play, you''re speaking their language. Don''t worry about being perfect - just be present and follow their lead.', 'development', '4-6'),

('Building Emotional Intelligence', 'Help your child name their emotions by saying things like "I can see you''re feeling angry" or "It looks like you might be disappointed." This helps them develop emotional vocabulary and self-awareness.', 'emotions', '4-6'),

('The Importance of Choice', 'Giving children age-appropriate choices helps them feel empowered and reduces power struggles. Instead of "Put on your shoes," try "Would you like to put on your red shoes or blue shoes?"', 'behavior', '4-6'),

('Active Listening Techniques', 'Show you''re listening by nodding, making eye contact, and asking follow-up questions. Avoid immediately jumping to solutions - sometimes kids just need to be heard and understood first.', 'communication', '7-8'),

('Encouraging Problem-Solving', 'When your child faces a challenge, resist the urge to immediately solve it for them. Instead, ask "What do you think we could try?" This builds confidence and critical thinking skills.', 'development', '7-8'),

('Setting Boundaries with Love', 'Clear, consistent boundaries actually make children feel safer and more loved. Explain the "why" behind rules and be firm but kind when enforcing them.', 'behavior', '7-8'),

('Building Self-Esteem', 'Focus on effort and character rather than just results. Instead of "You''re so smart," try "I love how hard you worked on that" or "You showed great kindness when you helped your friend."', 'emotions', '9-10'),

('Preparing for Independence', 'As children get older, gradually give them more responsibility and decision-making power. This prepares them for adolescence while still providing a safety net of support and guidance.', 'development', '9-10');
