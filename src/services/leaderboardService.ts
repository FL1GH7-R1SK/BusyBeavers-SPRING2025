
import { supabase } from '@/lib/supabase';

// Function to get all users on your leaderboard with their scores
export const getLeaderboardUsers = async () => {
  try {
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Get connections from leaderboard_connections
    const { data: connections, error: connectionsError } = await supabase
      .from('leaderboard_connections')
      .select('friend_id')
      .eq('user_id', user.id);
    
    if (connectionsError) throw connectionsError;
    
    if (!connections.length) {
      return [];
    }
    
    // Extract friend IDs
    const friendIds = connections.map(conn => conn.friend_id);
    
    // Get user details and habit completion stats
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id, 
        name, 
        email, 
        total_completions
      `)
      .in('id', [...friendIds, user.id]);
    
    if (profilesError) throw profilesError;
    
    // Sort by total_completions in descending order
    return profilesData.sort((a, b) => b.total_completions - a.total_completions);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

// Function to add a user to your leaderboard
export const addUserToLeaderboard = async (friendEmail: string) => {
  try {
    // Normalize the email - trim and convert to lowercase
    const normalizedEmail = friendEmail.trim().toLowerCase();
    
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    console.log('Current user ID:', user.id);
    console.log('Searching for user with normalized email:', normalizedEmail);
    
    // Try a direct SQL query approach instead of ORM methods
    // Use let instead of const to allow reassignment
    let profileResults;
    
    // First try exact match
    const { data: exactMatches, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .neq('id', user.id) // Exclude current user
      .filter('email', 'eq', normalizedEmail); // Use filter for exact match after normalization
    
    console.log('Exact match query result:', { exactMatches, profilesError });
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
      throw profilesError;
    }
    
    // If no exact match, try a more lenient search
    if (!exactMatches || exactMatches.length === 0) {
      console.log('No exact match found, trying partial match...');
      const { data: partialMatches, error: partialError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .neq('id', user.id) // Exclude current user
        .ilike('email', `%${normalizedEmail}%`); // Use contains search
      
      console.log('Partial match results:', { partialMatches, partialError });
      
      // Check what profiles are actually available (for debugging)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('email, id')
        .limit(20);
      
      console.log('Available profile emails (up to 20):', allProfiles);
      
      if (!partialMatches || partialMatches.length === 0) {
        throw new Error('User not found. Please check the email address and try again.');
      }
      
      // Use the partial matches
      profileResults = partialMatches;
    } else {
      // Use the exact matches
      profileResults = exactMatches;
    }
    
    // Take the first match
    const friendData = profileResults[0];
    console.log('Selected friend data:', friendData);
    
    // Check if this is yourself (shouldn't happen with neq above, but double-check)
    if (friendData.id === user.id) {
      throw new Error('You cannot add yourself to the leaderboard');
    }
    
    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabase
      .from('leaderboard_connections')
      .select()
      .eq('user_id', user.id)
      .eq('friend_id', friendData.id)
      .maybeSingle();
    
    console.log('Existing connection check:', { existingConnection, checkError });
    
    if (checkError) throw checkError;
    
    if (existingConnection) {
      throw new Error('This user is already on your leaderboard');
    }
    
    // Add connection
    const { data: insertData, error: insertError } = await supabase
      .from('leaderboard_connections')
      .insert({
        user_id: user.id,
        friend_id: friendData.id
      })
      .select();
    
    console.log('Insert result:', { insertData, insertError });
    
    if (insertError) {
      console.error('Error inserting connection:', insertError);
      throw insertError;
    }
    
    return friendData;
  } catch (error) {
    console.error('Error adding user to leaderboard:', error);
    throw error;
  }
};

// Function to remove a user from your leaderboard
export const removeUserFromLeaderboard = async (friendId: string) => {
  try {
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Delete connection
    const { error } = await supabase
      .from('leaderboard_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('friend_id', friendId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing user from leaderboard:', error);
    throw error;
  }
};
