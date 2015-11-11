<?php
/**
 * @file
 * Contains the theme's functions to manipulate Drupal's default markup.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728096
 */

/**
 * Override or insert variables into the HTML head.
 *
 * @param $head_elements
 *   An array of variables to pass to the HTML head.
 */
function main_html_head_alter(&$head_elements) {
  // remove unneeded links
  $remove = array(
    '/^drupal_add_html_head_link:shortcut icon:/', // Favicon
  );
  foreach ($remove as $item) {
    foreach (preg_grep($item, array_keys($head_elements)) as $key) {
      unset($head_elements[$key]);
    }
  }
}

// Adds row count to all views classes
function main_preprocess_views_view(&$vars) {
  $vars['classes_array'][] = 'view-count-' . count($vars['view']->result);
}

// Change LI class name on special menu items
function main_process_menu_link(&$variables, $hook) {
  if ($variables['element']['#href'] == '<block>') {
    array_unshift($variables['element']['#attributes']['class'], 'special-block');
  }
}

function main_preprocess_node(&$variables) {
  // Redirect non delta project to first delta
  if($variables['type'] == "project") {
    drupal_goto($variables['node_url'] . '/1');
  }
}

function main_preprocess_entity(&$variables) {
  if($variables['elements']['#bundle'] == "project_image") {
    $current_path = substr($_SERVER['REQUEST_URI'], 1);
    $entity_id = $variables['elements']['#entity']->id;
    $current_delta = 0;
    $next_delta = 0;

    $path_arguments = explode('/', $current_path);

    // Check if 3 arguments are there
    if(count($path_arguments) == 3) {
      $node_alias = $path_arguments[0] . "/" . $path_arguments[1];
      // Create node path out of the first two arguments to see if it's a node
      if($node_path = drupal_lookup_path('source', $node_alias)) {
        $node = menu_get_object("node", 1, $node_path);

        // Check if node is of the right type
        if($node->type == "project") {
          // Check if third argument is a number
          if(is_numeric($path_arguments[2])) {
            // Load images field
            $images = field_get_items('node', $node, 'field_project_images');

            foreach($images as $delta => $image) {
              if($image['target_id'] == $entity_id) {
                $current_delta = $delta;
                break;
              }
            }

            // Check if the next delta is valid
            // if not, redirect to 1
            if(array_key_exists($current_delta+1, $images)) {
              $next_delta = $current_delta+1;
            } else {
              $next_delta = 0;
            }

            $variables['next_link'] = '/' . $node_alias . '/' . ($next_delta+1);
          }
        }
      }
    }
  }
}
