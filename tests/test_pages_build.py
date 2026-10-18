"""Static artifact configuration must not publish localhost or credentials."""
import unittest
from tools.site.build_pages import configuration


class PagesBuildTests(unittest.TestCase):
    def test_production_configuration_is_https_and_not_test_only(self):
        self.assertEqual(configuration('/QualiCraft', 'https://qt.example.org/w/'),
                         {'prefix': '/QualiCraft', 'workbench': 'https://qt.example.org/w', 'test_only': False})

    def test_bad_targets_are_rejected(self):
        for target in ['http://qt.example.org/w', 'https://u:secret@qt.example.org/w',
                       'https://qt.example.org/w?token=x', 'https://qt.example.org/w#x',
                       'https://qt.example.org/', 'https://pending.invalid/w',
                       'https://127.0.0.1/w', 'http://localhost:8000/w']:
            with self.subTest(target=target), self.assertRaises(ValueError):
                configuration('/QualiCraft', target)

    def test_loopback_build_is_explicitly_marked_test_only(self):
        self.assertTrue(configuration('/QualiCraft', 'http://127.0.0.1:8000/w', True)['test_only'])

    def test_prefix_must_not_escape_repository(self):
        for prefix in ['QualiCraft', '/QualiCraft/', '/..', '/x?y', '/x#y']:
            with self.subTest(prefix=prefix), self.assertRaises(ValueError):
                configuration(prefix, 'https://qt.example.org/w')
